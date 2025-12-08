import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, AlertOctagon, Activity, CheckCircle, Clock } from 'lucide-react';
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { getContract, prepareContractCall, defineChain, createThirdwebClient } from "thirdweb";
import { deployContract } from "thirdweb/deploys";
import { VulnerableBoxArtifact } from './contracts/VulnerableBox';
import { SafeBoxArtifact } from './contracts/SafeBox';
import { PausableBoxArtifact } from './contracts/PausableBox';
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
  onComplete: (results: any[]) => void;
  targets: any[];
}

export function Surgeon({ onComplete, targets }: SurgeonProps) {
  const account = useActiveAccount();
  const { mutateAsync: sendTx } = useSendTransaction();
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const [currentAction, setCurrentAction] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Auto-execute if account is connected
  useEffect(() => {
    if (account && status === 'idle' && targets.length > 0) {
      processQueue();
    }
  }, [account, status, targets]);

  const processQueue = async () => {
      setStatus('processing');
      const finalResults = [];

      for (let i = 0; i < targets.length; i++) {
          setCurrentIndex(i);
          const target = targets[i];
          const action = (target as any)?.action || 'upgrade';
          setCurrentAction(`Processing ${target.name} (${action})...`);

          try {
              let result;
              if (action === 'upgrade') {
                  result = await executeUpgrade(target.address);
              } else {
                  result = await executePause(target.address);
              }
              finalResults.push({ ...target, ...result, success: true });
          } catch (err: any) {
              console.error(`Failed to process ${target.name}:`, err);
              finalResults.push({ ...target, success: false, error: err.message });
              // We continue to the next one even if one fails
          }
      }

      setResults(finalResults);
      setStatus('success');
      onComplete(finalResults);
  };

  const executeUpgrade = async (targetAddress: string) => {
    console.log(`Upgrading ${targetAddress}...`);

    // Step 1: Deploy Safe Implementation
    const safeImplementationAddress = await deployContract({
        client,
        chain,
        account: account!,
        bytecode: SafeBoxArtifact.bytecode as `0x${string}`,
        abi: SafeBoxArtifact.abi,
    });

    // Step 2: Call upgradeTo
    const targetContract = getContract({
        client,
        chain,
        address: targetAddress,
        abi: VulnerableBoxArtifact.abi
    });

    const transaction = prepareContractCall({
        contract: targetContract,
        method: "upgradeTo",
        params: [safeImplementationAddress]
    });

    const receipt = await sendTx(transaction);

    return {
        type: 'upgrade',
        txHash: receipt.transactionHash,
        newImplementation: safeImplementationAddress
    };
  };

  const executePause = async (targetAddress: string) => {
      console.log(`Pausing ${targetAddress}...`);

      const targetContract = getContract({
          client,
          chain,
          address: targetAddress,
          abi: PausableBoxArtifact.abi
      });

      const transaction = prepareContractCall({
          contract: targetContract,
          method: "pause",
          params: []
      });

      const receipt = await sendTx(transaction);

      return {
          type: 'pause',
          txHash: receipt.transactionHash,
          status: 'PAUSED'
      };
  };

  const progressPercentage = ((currentIndex) / (targets.length || 1)) * 100;

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

      <h2 className="text-3xl font-display mb-2">
          {status === 'success' ? "All Patches Applied." : "Executing Batch Fixes..."}
      </h2>

      {/* Progress UI */}
      <div className="mt-8 w-full max-w-md space-y-4">

        <div className="flex items-center justify-between text-sm text-white/70">
            <span>Progress</span>
            <span>{currentIndex + (status === 'success' ? 0 : 1)} / {targets.length}</span>
        </div>

        {/* Progress Bar */}
        <div className="h-4 bg-white/10 rounded-full overflow-hidden relative">
           <motion.div
             className="h-full bg-surgeon"
             initial={{ width: 0 }}
             animate={{ width: `${status === 'success' ? 100 : progressPercentage}%` }}
             transition={{ duration: 0.5 }}
           />
           {status === 'processing' && (
                <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                />
           )}
        </div>

        <div className="text-center font-mono text-xs text-surgeon h-6 mt-2">
            {status === 'processing' ? currentAction : "Operation Complete"}
        </div>

        {/* Current Target Details */}
        {status === 'processing' && targets[currentIndex] && (
             <div className="mt-4 p-4 glass-panel border-surgeon/30 rounded flex items-center justify-between">
                <div>
                    <div className="text-xs text-white/50 uppercase">Targeting</div>
                    <div className="text-white font-bold">{targets[currentIndex].name}</div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-white/50 uppercase">Action</div>
                    <div className="text-surgeon font-bold uppercase">{targets[currentIndex].action}</div>
                </div>
             </div>
        )}

        {/* Wallet Prompt */}
        {!account && (
            <div className="mt-4 text-center text-white/60 animate-pulse border border-dashed border-white/20 p-4 rounded">
                Please connect your wallet to authorize surgery.
            </div>
        )}

        {/* Error State */}
        {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded text-red-200 text-sm">
                Error: {error}
                <Button onClick={() => setStatus('idle')} className="mt-2 w-full">Retry</Button>
            </div>
        )}
      </div>
    </div>
  );
}
