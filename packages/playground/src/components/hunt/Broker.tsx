import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HandCoins, TrendingUp, ShieldCheck, Database } from 'lucide-react';
import curesData from '../../data/cures.json';

interface BrokerProps {
  agentMessage?: string;
}

export function Broker({ agentMessage }: BrokerProps) {
  const [fee, setFee] = useState(0.01);
  const [cures, setCures] = useState<any[]>([]);

  useEffect(() => {
    // Simulate negotiating/settling
    const interval = setInterval(() => {
      setFee(prev => {
        if (prev >= 2.5) {
          clearInterval(interval);
          return 2.5;
        }
        return prev + 0.15;
      });
    }, 100);

    // Load cures
    if (curesData && curesData.cures) {
        setCures(Object.values(curesData.cures));
    }

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-broker w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6 relative"
      >
        <div className="absolute inset-0 bg-broker/20 blur-2xl rounded-full" />
        <HandCoins className="w-16 h-16 relative z-10" />
      </motion.div>

      <h2 className="text-2xl font-display mb-2 uppercase tracking-widest">Consulting Library of Cures...</h2>
      <p className="text-broker/60 font-mono text-sm mb-8">Identifying Patch Vectors from Knowledge Base</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-8">
          {/* Cures List */}
          <div className="glass-panel rounded-xl border-broker/30 p-4 max-h-[300px] overflow-y-auto">
             <div className="flex items-center gap-2 mb-4 text-white/80 border-b border-white/10 pb-2">
                 <Database className="w-4 h-4 text-broker" />
                 <span className="font-bold text-xs uppercase">Proposed Cures</span>
             </div>
             <div className="space-y-3">
                 {cures.slice(0, 3).map((cure, idx) => (
                     <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.2 }}
                        className="flex items-center gap-3 text-xs"
                     >
                         <ShieldCheck className="w-3 h-3 text-emerald-400" />
                         <span className="text-white/70 font-mono">{cure.name}</span>
                     </motion.div>
                 ))}
                 <div className="text-xs text-center text-white/30 italic pt-2">+ 2 more optimized patches</div>
             </div>
          </div>

          {/* Gas Estimate */}
          <div className="glass-panel rounded-xl border-broker/30 p-6 flex flex-col justify-center items-center">
            <div className="flex items-center justify-between gap-8 mb-2 w-full">
            <span className="text-white/60 text-xs uppercase tracking-wider">Total Upgrade Cost</span>
            <TrendingUp className="w-4 h-4 text-broker" />
            </div>
            <div className="text-5xl font-mono font-bold text-white flex items-baseline gap-2">
            {fee.toFixed(2)} <span className="text-lg text-broker font-sans">HBAR</span>
            </div>
            <div className="mt-4 text-[10px] text-emerald-400 bg-emerald-900/20 px-2 py-1 rounded border border-emerald-900/50">
                Authorized by Consensus
            </div>
          </div>
      </div>
    </div>
  );
}
