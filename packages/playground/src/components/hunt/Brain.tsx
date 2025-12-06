import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Lock, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from './ui';

interface BrainProps {
  txHash: string;
  newImpl: string;
  onReset: () => void;
}

export function Brain({ txHash, newImpl, onReset }: BrainProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-brain">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring" }}
        className="mb-8 relative"
      >
        <div className="absolute inset-0 bg-brain/20 blur-2xl rounded-full" />
        <ShieldCheck className="w-24 h-24 relative z-10" />
      </motion.div>

      <h2 className="text-3xl font-display mb-2">System Secured.</h2>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 p-6 glass-panel rounded-xl border-brain/30 max-w-lg w-full"
      >
        <div className="space-y-4">
            <div>
                <label className="text-xs text-white/50 uppercase tracking-widest">Transaction Hash</label>
                <div className="flex items-center gap-2 text-white font-mono text-sm truncate bg-black/20 p-2 rounded mt-1">
                    <span className="truncate">{txHash || "0x00...000"}</span>
                </div>
            </div>

            <div>
                <label className="text-xs text-white/50 uppercase tracking-widest">New Implementation</label>
                <div className="flex items-center gap-2 text-white font-mono text-sm truncate bg-black/20 p-2 rounded mt-1">
                     <span className="truncate">{newImpl || "0x00...000"}</span>
                </div>
            </div>

            <a
              href={`https://hashscan.io/testnet/transaction/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-brain hover:text-white transition-colors text-sm mt-4 p-2 border border-brain/30 rounded hover:bg-brain/10"
            >
                <ExternalLink className="w-4 h-4" />
                Verified on Hashscan
            </a>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8"
      >
          <Button onClick={onReset} className="bg-white/5 border-white/10 text-white/50 hover:text-white">
              Reset System
          </Button>
      </motion.div>
    </div>
  );
}
