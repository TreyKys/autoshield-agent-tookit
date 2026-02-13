import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Button } from './ui';

interface HeroProps {
  onActivate: () => void;
}

export function Hero({ onActivate }: HeroProps) {
  const [targetAddress, setTargetAddress] = useState('');

  useEffect(() => {
    // Try to load from env
    const envAddr = import.meta.env.VITE_TARGET_ADDRESS;
    if (envAddr) setTargetAddress(envAddr);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center h-full w-full relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-midnight/50 to-midnight pointer-events-none" />

      <div className="z-10 flex flex-col items-center text-center space-y-8 max-w-2xl px-4">

        {/* Large Shield Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 0.8 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="relative"
        >
          <Shield className="w-48 h-48 text-gray-500/20 stroke-[1px]" />
          <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full -z-10" />
        </motion.div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white tracking-tight">
            Auto-Shield 1.0
          </h1>
          <p className="text-xl text-gray-400 font-light max-w-lg mx-auto leading-relaxed">
            Autonomous Defense. Zero Latency Protection.
          </p>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto my-6" />
          <p className="text-xs tracking-[0.2em] text-gray-500 font-mono uppercase">
            DETECT • NEGOTIATE • PATCH • VERIFY • SECURE
          </p>
        </div>

        {/* Activate Button */}
        <div className="pt-8 relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
           <Button
            onClick={onActivate}
            className="relative px-8 py-6 text-lg bg-midnight border-white/20 hover:bg-white/5 hover:border-indigo-500/50 transition-all duration-300 w-64"
           >
             <span className="font-display tracking-widest mr-2">ACTIVATE</span>
             <Shield className="w-4 h-4 ml-2 group-hover:text-indigo-400 transition-colors" />
           </Button>
        </div>

        {/* Input for target address if not set */}
        {!import.meta.env.VITE_TARGET_ADDRESS && (
           <div className="mt-4 text-xs text-gray-600">
             Target: {targetAddress || "Not Configured (Using Demo Logic)"}
           </div>
        )}

      </div>
    </motion.div>
  );
}
