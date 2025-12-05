import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HandCoins, TrendingUp } from 'lucide-react';

export function Broker() {
  const [fee, setFee] = useState(0.01);

  useEffect(() => {
    // Simulate negotiating/settling
    const interval = setInterval(() => {
      setFee(prev => {
        if (prev >= 0.5) {
          clearInterval(interval);
          return 0.5;
        }
        return prev + 0.05;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-broker">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 relative"
      >
        <div className="absolute inset-0 bg-broker/20 blur-2xl rounded-full" />
        <HandCoins className="w-24 h-24 relative z-10" />
      </motion.div>

      <h2 className="text-3xl font-display mb-2">Negotiating Fix...</h2>

      <div className="mt-6 p-6 glass-panel rounded-xl border-broker/30">
        <div className="flex items-center justify-between gap-8 mb-2">
           <span className="text-white/60 text-sm uppercase tracking-wider">Estimated Gas</span>
           <TrendingUp className="w-4 h-4 text-broker" />
        </div>
        <div className="text-5xl font-mono font-bold text-white flex items-baseline gap-2">
           {fee.toFixed(2)} <span className="text-lg text-broker font-sans">HBAR</span>
        </div>
      </div>
    </div>
  );
}
