import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Lock, ExternalLink, ShieldCheck, List } from 'lucide-react';
import { Button } from './ui';

interface BrainProps {
  txHash: string;
  result: any; // Updated to handle batch result object
  onReset: () => void;
}

export function Brain({ txHash, result, onReset }: BrainProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-brain w-full max-w-4xl mx-auto p-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring" }}
        className="mb-6 relative"
      >
        <div className="absolute inset-0 bg-brain/20 blur-2xl rounded-full" />
        <ShieldCheck className="w-24 h-24 relative z-10" />
      </motion.div>

      <h2 className="text-3xl font-display mb-2">Network Immunized.</h2>
      <p className="text-brain/60 font-mono text-sm mb-8">Atomic Batch Successfully Executed</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-4">

          {/* Summary Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-6 glass-panel rounded-xl border-brain/30 w-full"
          >
            <h3 className="text-sm text-white/50 uppercase tracking-widest mb-4">Operations Summary</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
                 <div className="bg-brain/10 p-4 rounded-lg text-center">
                     <div className="text-3xl font-bold text-white mb-1">{result?.upgraded || 0}</div>
                     <div className="text-[10px] text-brain uppercase">Contracts Patched</div>
                 </div>
                 <div className="bg-brain/10 p-4 rounded-lg text-center">
                     <div className="text-3xl font-bold text-white mb-1">{result?.paused || 0}</div>
                     <div className="text-[10px] text-brain uppercase">Contracts Paused</div>
                 </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-xs text-white/50 uppercase tracking-widest">Batch Executor</label>
                    <div className="font-mono text-xs text-white/80 bg-black/20 p-2 rounded mt-1 truncate">
                        {result?.executor || "Unknown"}
                    </div>
                </div>
            </div>
          </motion.div>

          {/* Transaction Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="p-6 glass-panel rounded-xl border-brain/30 w-full flex flex-col justify-between"
          >
             <div>
                <h3 className="text-sm text-white/50 uppercase tracking-widest mb-4">On-Chain Proof</h3>

                <div className="mb-4">
                    <label className="text-xs text-white/50 uppercase tracking-widest">Atomic Transaction Hash</label>
                    <div className="font-mono text-xs text-white/80 bg-black/20 p-2 rounded mt-1 break-all">
                        {txHash}
                    </div>
                </div>
             </div>

            <a
              href={`https://hashscan.io/testnet/transaction/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-brain hover:text-white transition-colors text-sm mt-4 p-3 border border-brain/30 rounded hover:bg-brain/10 w-full"
            >
                <ExternalLink className="w-4 h-4" />
                View on Hashscan
            </a>
          </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8"
      >
          <Button onClick={onReset} className="bg-white/5 border-white/10 text-white/50 hover:text-white">
              Reset Agent Memory
          </Button>
      </motion.div>
    </div>
  );
}
