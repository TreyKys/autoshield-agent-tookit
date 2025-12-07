import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, AlertOctagon, Activity } from 'lucide-react';
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { getContract, prepareContractCall, defineChain, createThirdwebClient } from "thirdweb";
import { deployContract } from "thirdweb/deploys";
import { VulnerableBoxArtifact } from './contracts/VulnerableBox';
import { SafeBoxArtifact } from './contracts/SafeBox';
import { Button } from './ui';

// Client initialization
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "c06411514757049826317b6a782b137a", // Should come from env
});

// Hedera Testnet
const chain = defineChain({
  id: 296,
  name: "Hedera Testnet",
  nativeCurrency: { name: "HBAR", symbol: "HBAR", decimals: 18 },
  rpc: "https://testnet.hashio.io/api",
  testnet: true,
});

interface SurgeonProps {
  onComplete: (txHash: string, newImpl: string) => void;
  targetAddress?: string;
}

export function Surgeon({ onComplete, targetAddress }: SurgeonProps) {
  const account = useActiveAccount();
  const { mutate: sendTx, isPending } = useSendTransaction();
  const [status, setStatus] = useState<'idle' | 'deploying' | 'upgrading' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);

  // Auto-execute if account is connected, otherwise wait
  useEffect(() => {
    if (account && status === 'idle') {
      executeSurgery();
    }
  }, [account, status]);

  const executeSurgery = async () => {
    if (!account) return;
    setStatus('deploying');
    setError(null);

    try {
      // Step 1: Deploy Safe Implementation
      console.log("Deploying Safe Implementation...");
      // For demo speed, we might want to skip this if we had a pre-deployed one,
      // but to be "REAL", we deploy it.

      const safeImplementationAddress = await deployContract({
        client,
        chain,
        account,
        bytecode: SafeBoxArtifact.bytecode as `0x${string}`,
        abi: SafeBoxArtifact.abi,
      });

      console.log("Safe Implementation:", safeImplementationAddress);
      setStatus('upgrading');

      // Step 2: Call upgradeTo on Target
      // const targetAddress = process.env.NEXT_PUBLIC_TARGET_ADDRESS;
      if (!targetAddress) {
        throw new Error("No Target Address provided by Hunter. Scan may have failed.");
      }

      const targetContract = getContract({
        client,
        chain,
        address: targetAddress,
        abi: VulnerableBoxArtifact.abi
      });

      const transaction = prepareContractCall({
        contract: targetContract,
        method: "upgradeTo", // Assuming the ABI has this from the UUPS/Proxy logic or similar
        params: [safeImplementationAddress],
        gas: BigInt(200000) // Explicit gas limit to avoid estimation issues on older Hedera nodes
      });

      sendTx(transaction, {
        onSuccess: (txReciept) => {
            console.log("Upgrade Success:", txReciept.transactionHash);
            setStatus('success');
            onComplete(txReciept.transactionHash, safeImplementationAddress);
        },
        onError: (err) => {
            console.error("Upgrade Failed:", err);
            setError(err.message);
            // For demo purposes, if it fails (e.g. not owner), we might still want to show the error
            // or maybe simulate success if it's just a visual demo?
            // The prompt says "Trigger the REAL...". So failure is real.
        }
      });

    } catch (err: any) {
      console.error("Surgery Failed:", err);
      setError(err.message || "Unknown error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-surgeon">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="mb-8 relative"
      >
        <div className="absolute inset-0 bg-surgeon/20 blur-2xl rounded-full" />
        <Activity className="w-24 h-24 relative z-10" />
      </motion.div>

      <h2 className="text-3xl font-display mb-2">Executing Patch...</h2>

      {/* Status Indicators */}
      <div className="mt-8 w-full max-w-md space-y-4">
        <div className="flex items-center justify-between text-sm">
           <span className={status === 'deploying' || status === 'upgrading' || status === 'success' ? "text-white" : "text-white/30"}>
             1. Deploy Safe Impl
           </span>
           {status === 'deploying' && <span className="animate-pulse text-surgeon">Processing...</span>}
           {(status === 'upgrading' || status === 'success') && <span className="text-green-500">Done</span>}
        </div>

        <div className="flex items-center justify-between text-sm">
           <span className={status === 'upgrading' || status === 'success' ? "text-white" : "text-white/30"}>
             2. Upgrade Proxy
           </span>
           {status === 'upgrading' && <span className="animate-pulse text-surgeon">Sign Tx...</span>}
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
