import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Bug } from 'lucide-react';

interface HunterProps {
  agentMessage?: string;
}

export function Hunter({ agentMessage }: HunterProps) {
  const [bugsFound, setBugsFound] = useState(0);

  useEffect(() => {
    if (agentMessage && agentMessage.toLowerCase().includes('found')) {
       // Simple heuristic: if agent says "found", assume 1 bug or parse number
       setBugsFound(1);
    } else {
       // Fallback mock
       const timer = setTimeout(() => {
         setBugsFound(1);
       }, 1500);
       return () => clearTimeout(timer);
    }
  }, [agentMessage]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-hunter">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-8 relative"
      >
        <div className="absolute inset-0 bg-hunter/20 blur-2xl rounded-full animate-pulse" />
        <Search className="w-24 h-24 relative z-10" />
      </motion.div>

      <h2 className="text-3xl font-display mb-2">Scanning Contract...</h2>

      <div className="flex items-center gap-4 text-4xl font-mono font-bold mt-4">
        <motion.span
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          key={bugsFound}
        >
          {bugsFound}
        </motion.span>
        <span className="text-xl font-sans font-normal text-white/60">Critical Vulnerability Found</span>
      </div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 2 }}
        className="h-1 bg-hunter/50 w-64 mt-8 rounded-full overflow-hidden"
      >
        <motion.div
          className="h-full bg-hunter"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
}
