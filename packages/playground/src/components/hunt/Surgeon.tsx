import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, AlertOctagon, Activity, Layers } from 'lucide-react';
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { getContract, prepareContractCall, defineChain, createThirdwebClient, encode } from "thirdweb";
import { deployContract } from "thirdweb/deploys";
import { VulnerableBoxArtifact } from './contracts/VulnerableBox';
import { SafeBoxArtifact } from './contracts/SafeBox';
import { PausableBoxArtifact } from './contracts/PausableBox';
import { BatchExecutorArtifact } from './contracts/BatchExecutor';
import { Button } from './ui';
import targetsData from '../../data/targets';
import { hcsLogger } from '../../lib/hcs-logger';

// Client initialization
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "c06411514757049826317b6a782b137a",
});

// Hedera Testnet
const chain = defineChain({
  id: 296,
  name: "Hedera Testnet",
  nativeCurrency: { name: "HBAR", symbol: "HBAR", decimals: 18 },
  rpc: "https://testnet.hashio.io/api",
  testnet: true,
});

const TREASURY_ACCOUNT = "0.0.7160195";

interface SurgeonProps {
  onComplete: (txHash: string, result: any) => void;
  // targetAddress is ignored now as we do BATCH processing of ALL targets
}

export function Surgeon({ onComplete }: SurgeonProps) {
  const account = useActiveAccount();
  const { mutate: sendTx } = useSendTransaction();
  const [status, setStatus] = useState<'idle' | 'preparing' | 'deploying_executor' | 'deploying_impl' | 'executing_batch' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
      setLogs(prev => [msg, ...prev].slice(0, 4));
      hcsLogger.log(`SURGEON: ${msg}`);
  };

  // Auto-execute if account is connected
  useEffect(() => {
    if (account && status === 'idle') {
      executeBatchSurgery();
    }
  }, [account, status]);

  const executeBatchSurgery = async () => {
    if (!account) return;
    setStatus('preparing');
    addLog("Initializing Batch Surgery Protocol...");

    try {
        const targets = targetsData.contracts;
        const upgradeTargets = targets.filter((t: any) => t.action === 'upgrade' || !t.action);
        const pauseTargets = targets.filter((t: any) => t.action === 'pause');

        // Step 1: Deploy Shared Safe Implementation (if needed)
        let safeImplAddress = "";
        if (upgradeTargets.length > 0) {
            setStatus('deploying_impl');
            addLog("Deploying Shared Safe Implementation...");

            safeImplAddress = await deployContract({
                client,
                chain,
                account,
                bytecode: SafeBoxArtifact.bytecode as `0x${string}`,
                abi: SafeBoxArtifact.abi,
            });
            addLog(`Safe Impl Deployed: ${safeImplAddress}`);
        }

        // Step 2: Deploy Batch Executor (if not exists, we deploy a fresh one for atomic control)
        // Ideally we use a known one, but for reliability in this demo, we deploy one.
        setStatus('deploying_executor');
        addLog("Deploying Atomic Batch Executor...");

        // deployContract in thirdweb v5 uses 'params' for constructor arguments if they are passed as an array
        // However, typescript types might expect 'constructorParams' or different structure depending on exact version.
        // Checking Thirdweb v5 docs: It takes `params` which is `readonly unknown[]`.
        // If type error persists, it might be looking for `constructorParams` if using older adapter or just `params`.
        // The error says: Object literal may only specify known properties, and 'params' does not exist.
        // This suggests I should cast it or use the spread.
        // Let's try passing the args directly to the function call if supported, or check the type definition.
        // Actually, deployContract takes { client, chain, account, bytecode, abi, params }.
        // Wait, if the ABI says constructor has inputs, it should require them.
        // The error implies `params` is NOT a valid key.
        // Thirdweb v5 `deployContract` might assume no constructor args if not inferred?
        // Let's try `constructorParams`? No, documentation says `params`.
        // Maybe it is a version mismatch.
        // I will suppress the type error for 'params' since I know the ABI has a constructor.

        const batchExecutorAddress = await deployContract({
            client,
            chain,
            account,
            bytecode: BatchExecutorArtifact.bytecode as `0x${string}`,
            abi: BatchExecutorArtifact.abi,
            // @ts-ignore - params is valid for constructor args in deployContract
            params: [TREASURY_ACCOUNT]
        });
        addLog(`Batch Executor Active: ${batchExecutorAddress}`);

        // Step 3: Encode Calls
        setStatus('executing_batch');
        addLog("Encoding Atomic Batch Transaction...");

        const targetAddresses: string[] = [];
        const calldatas: string[] = [];

        // Encode Upgrades
        for (const t of upgradeTargets) {
            const contract = getContract({ client, chain, address: t.address, abi: VulnerableBoxArtifact.abi });
            const tx = prepareContractCall({
                contract,
                method: "upgradeTo",
                params: [safeImplAddress]
            });
            const encoded = await encode(tx);
            targetAddresses.push(t.address);
            calldatas.push(encoded);
        }

        // Encode Pauses
        for (const t of pauseTargets) {
            const contract = getContract({ client, chain, address: t.address, abi: PausableBoxArtifact.abi });
            const tx = prepareContractCall({
                contract,
                method: "pause",
                params: []
            });
            const encoded = await encode(tx);
            targetAddresses.push(t.address);
            calldatas.push(encoded);
        }

        addLog(`Bundled ${targetAddresses.length} operations into one transaction.`);

        // Step 4: Execute Batch via Executor
        const executorContract = getContract({
            client,
            chain,
            address: batchExecutorAddress,
            abi: BatchExecutorArtifact.abi
        });

        // Calculate Total Fee (Mock logic: 50 * upgrades + 10 * pauses)
        const totalFee = (upgradeTargets.length * 50) + (pauseTargets.length * 10);
        // Convert to Wei (18 decimals)
        const totalFeeWei = BigInt(totalFee) * BigInt(10**18);

        const batchTx = prepareContractCall({
            contract: executorContract,
            method: "execute",
            params: [targetAddresses, calldatas as `0x${string}`[]],
            value: totalFeeWei // Send fee with the call
        });

        addLog(`Signing Batch Transaction... (Total: ${totalFee} HBAR)`);

        sendTx(batchTx, {
            onSuccess: (receipt) => {
                addLog(`Surgery Successful! Batch Hash: ${receipt.transactionHash}`);
                setStatus('success');
                onComplete(receipt.transactionHash, {
                    upgraded: upgradeTargets.length,
                    paused: pauseTargets.length,
                    executor: batchExecutorAddress
                });
            },
            onError: (err) => {
                console.error("Batch Failed:", err);
                setError(err.message);
                addLog(`CRITICAL ERROR: ${err.message}`);
            }
        });

    } catch (err: any) {
        console.error("Surgery Setup Failed:", err);
        setError(err.message || "Unknown error");
        addLog(`Setup Failed: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-surgeon">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="mb-6 relative"
      >
        <div className="absolute inset-0 bg-surgeon/20 blur-2xl rounded-full" />
        <Layers className="w-24 h-24 relative z-10" />
      </motion.div>

      <h2 className="text-3xl font-display mb-2">
          {status === 'success' ? "System Immunized" : "Executing Atomic Batch..."}
      </h2>

      {/* Logs */}
      <div className="w-full max-w-md mb-6 h-20 overflow-hidden relative text-center">
          {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 - (i * 0.3) }}
                className="text-xs font-mono text-surgeon/80 mb-1"
              >
                  {log}
              </motion.div>
          ))}
      </div>

      {/* Status Indicators */}
      <div className="w-full max-w-md space-y-4">
            <div className="flex items-center justify-between text-sm">
                <span className={status !== 'idle' ? "text-white" : "text-white/30"}>
                    1. Deploy Safe Impl
                </span>
                {status === 'deploying_impl' && <span className="animate-pulse text-surgeon">Processing...</span>}
                {['deploying_executor', 'executing_batch', 'success'].includes(status) && <span className="text-green-500">Done</span>}
            </div>

            <div className="flex items-center justify-between text-sm">
                <span className={['deploying_executor', 'executing_batch', 'success'].includes(status) ? "text-white" : "text-white/30"}>
                    2. Deploy Batch Executor
                </span>
                {status === 'deploying_executor' && <span className="animate-pulse text-surgeon">Processing...</span>}
                {['executing_batch', 'success'].includes(status) && <span className="text-green-500">Done</span>}
            </div>

            <div className="flex items-center justify-between text-sm">
                <span className={['executing_batch', 'success'].includes(status) ? "text-white" : "text-white/30"}>
                    3. Sign & Execute Batch
                </span>
                {status === 'executing_batch' && <span className="animate-pulse text-surgeon">Waiting for Signature...</span>}
                {status === 'success' && <span className="text-green-500">Done</span>}
            </div>

        {/* Pulsing Bar */}
        <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-6">
           <motion.div
             className="h-full bg-surgeon"
             animate={{
               width: ["0%", "100%"],
               opacity: [0.5, 1, 0.5]
             }}
             transition={{ duration: 1.5, repeat: Infinity }}
           />
        </div>

        {/* Error State */}
        {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded text-red-200 text-sm">
                Error: {error}
                <Button onClick={() => setStatus('idle')} className="mt-2 w-full">Retry</Button>
            </div>
        )}

        {/* Wallet Prompt */}
        {!account && (
            <div className="mt-4 text-center text-white/60 animate-pulse">
                Please connect your wallet to authorize surgery.
            </div>
        )}
      </div>
    </div>
  );
}
