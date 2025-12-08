import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, AlertOctagon, Activity, CheckCircle, Clock } from 'lucide-react';
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { getContract, prepareContractCall, defineChain, createThirdwebClient, prepareTransaction, toWei } from "thirdweb";
import { deployContract } from "thirdweb/deploys";
import { Button } from './ui';

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

const TREASURY_ACCOUNT = process.env.NEXT_PUBLIC_TREASURY_ACCOUNT_ID;

interface SurgeonProps {
  onComplete: (results: any[]) => void;
  data: any; // Contains targets, finalTotal, etc.
}

export function Surgeon({ onComplete, data }: SurgeonProps) {
  const account = useActiveAccount();
  const { mutateAsync: sendTx } = useSendTransaction();
  const [status, setStatus] = useState<'idle' | 'paying' | 'processing' | 'success'>('idle');
  const [progressText, setProgressText] = useState("Waiting for authorization...");
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { targets, finalTotal } = data;

  const handleAuthorize = async () => {
      if (!account || !TREASURY_ACCOUNT) {
          setError("Wallet not connected or Treasury configuration missing.");
          return;
      }

      setStatus('paying');
      setProgressText("Processing Payment...");

      try {
          // 1. Send Payment (One Big Transaction)
          // We transfer 'finalTotal' HBAR to the Treasury
          const transaction = prepareTransaction({
              to: TREASURY_ACCOUNT,
              chain,
              client,
              value: toWei(finalTotal.toString()), // Convert HBAR to Wei
          });

          const receipt = await sendTx(transaction);
          console.log("Payment sent:", receipt.transactionHash);

          setProgressText("Payment confirmed. Agent activating...");
          setStatus('processing');

          // 2. Trigger Agent Execution (Batch Fix)
          const response = await fetch('/api/agent/fix', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  targets,
                  paymentTxId: receipt.transactionHash
              })
          });

          const result = await response.json();

          if (!response.ok) {
              throw new Error(result.error || "Agent execution failed");
          }

          setResults(result.results);
          setStatus('success');
          setProgressText("All Operations Complete.");

          setTimeout(() => {
              onComplete(result.results);
          }, 2000);

      } catch (err: any) {
          console.error("Surgery failed:", err);
          setError(err.message || "Operation failed.");
          setStatus('idle'); // Allow retry?
      }
  };

  // Auto-start if status is idle? No, user must click button in Broker,
  // but wait, Broker calls onComplete which mounts Surgeon.
  // So Surgeon should probably start or show a summary and "Execute" button?
  // The Broker had "Sign & Authorize".
  // If the previous step was "Sign", then Surgeon should probably just start executing?
  // Or Surgeon is the "Execution View".
  // Let's make Surgeon auto-execute the logic upon mount if passed data?
  // "Making the user leave the browser all the time to approve transactions seems like very bad UX."
  // "One big transaction that automatically approves the rest"
  // So the user clicks "Sign" in Broker -> Transits to Surgeon -> Surgeon prompts wallet immediately.

  useEffect(() => {
      if (status === 'idle' && account) {
          handleAuthorize();
      }
  }, [status, account]); // Run once

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
          {status === 'success' ? "Mission Accomplished" : "Surgical Operation in Progress"}
      </h2>

      {/* Progress UI */}
      <div className="mt-8 w-full max-w-md space-y-4">

        <div className="text-center font-mono text-sm text-white/70 h-8">
            {error ? <span className="text-red-400">{error}</span> : progressText}
        </div>

        {/* Progress Bar */}
        <div className="h-4 bg-white/10 rounded-full overflow-hidden relative">
           <motion.div
             className="h-full bg-surgeon"
             initial={{ width: 0 }}
             animate={{
                 width: status === 'paying' ? '30%' :
                        status === 'processing' ? '80%' :
                        status === 'success' ? '100%' : '0%'
             }}
             transition={{ duration: 1 }}
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

        {/* Step Indicators */}
        <div className="flex justify-between text-xs text-white/30 uppercase font-mono mt-2">
            <span className={status === 'paying' || status === 'processing' || status === 'success' ? 'text-surgeon' : ''}>1. Payment</span>
            <span className={status === 'processing' || status === 'success' ? 'text-surgeon' : ''}>2. Agent Activation</span>
            <span className={status === 'success' ? 'text-surgeon' : ''}>3. Patch Verification</span>
        </div>

        {/* Wallet Prompt */}
        {!account && (
            <div className="mt-4 text-center text-white/60 animate-pulse border border-dashed border-white/20 p-4 rounded">
                Please connect your wallet to authorize surgery.
            </div>
        )}

        {/* Error State */}
        {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded text-red-200 text-sm">
                <Button onClick={() => setStatus('idle')} className="mt-2 w-full bg-red-500/20 hover:bg-red-500/40">Retry Operation</Button>
            </div>
        )}
      </div>
    </div>
  );
}
