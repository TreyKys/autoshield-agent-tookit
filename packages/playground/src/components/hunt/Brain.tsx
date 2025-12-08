import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Lock, ExternalLink, ShieldCheck, PauseCircle, ArrowUpCircle } from 'lucide-react';
import { Button } from './ui';

interface BrainProps {
  results: any[];
  onReset: () => void;
}

export function Brain({ results, onReset }: BrainProps) {
  const upgradedCount = results.filter(r => r.type === 'upgrade' && r.success).length;
  const pausedCount = results.filter(r => r.type === 'pause' && r.success).length;

  return (
    <div className="flex flex-col items-center justify-center h-full text-brain w-full max-w-4xl mx-auto">
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

      {/* Dynamic Summary Message */}
      <p className="text-white/70 mb-8 text-center max-w-lg">
          <span className="text-emerald-400 font-bold">{pausedCount}</span> contract{pausedCount !== 1 ? 's' : ''} wasn't upgradeable so it was paused instead. <br/>
          <span className="text-emerald-400 font-bold">{upgradedCount}</span> contract{upgradedCount !== 1 ? 's' : ''} successfully upgraded.
      </p>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto px-4 custom-scrollbar"
      >
        {results.map((res, idx) => (
            <div key={idx} className="glass-panel p-4 rounded-xl border-brain/30 flex items-center justify-between group hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${res.type === 'pause' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {res.type === 'pause' ? <PauseCircle className="w-5 h-5" /> : <ArrowUpCircle className="w-5 h-5" />}
                    </div>
                    <div>
                        <div className="font-bold text-white text-sm">{res.name}</div>
                        <div className="text-xs text-white/40 font-mono">{res.address}</div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <div className="text-xs text-white/50 uppercase tracking-widest">{res.type}d</div>
                        <div className="text-xs font-mono text-brain truncate w-24">{res.txHash ? `${res.txHash.substring(0,6)}...${res.txHash.substring(res.txHash.length-4)}` : 'Failed'}</div>
                    </div>

                    {res.txHash && (
                        <a
                        href={`https://hashscan.io/testnet/transaction/${res.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-white/30 hover:text-white transition-colors"
                        title="View on HashScan"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>
        ))}
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
