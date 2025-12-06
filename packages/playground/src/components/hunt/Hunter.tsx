import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Bug, FileWarning } from 'lucide-react';
import targetsData from '../../data/targets';

interface HunterProps {
  agentMessage?: string;
}

export function Hunter({ agentMessage }: HunterProps) {
  const [scannedTargets, setScannedTargets] = useState<any[]>([]);
  const [scanStatus, setScanStatus] = useState("Initializing Scan...");

  useEffect(() => {
    // Simulate reading from chain
    setScanStatus("Scanning Network...");

    const timer1 = setTimeout(() => {
        setScanStatus("Analyzing Bytecode...");
    }, 1000);

    const timer2 = setTimeout(() => {
        if (targetsData && targetsData.contracts) {
            setScannedTargets([...targetsData.contracts]);
        }
        setScanStatus("Scan Complete.");
    }, 2500);

    return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-hunter w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-6 relative"
      >
        <div className="absolute inset-0 bg-hunter/20 blur-2xl rounded-full animate-pulse" />
        <Search className="w-16 h-16 relative z-10" />
      </motion.div>

      <h2 className="text-2xl font-display mb-2 uppercase tracking-widest">{scanStatus}</h2>

      {scannedTargets.length > 0 && (
          <div className="w-full mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto px-4">
              {scannedTargets.map((target, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.2 }}
                    className="bg-midnight/80 border border-hunter/30 p-4 rounded-lg flex items-start gap-3 hover:border-hunter/60 transition-colors"
                  >
                      <div className="p-2 bg-hunter/10 rounded-md">
                          <FileWarning className="w-6 h-6 text-hunter" />
                      </div>
                      <div>
                          <h3 className="font-mono font-bold text-white text-sm">{target.name}</h3>
                          <p className="text-xs text-hunter/80 font-mono mt-1">{target.address}</p>
                          <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-900/30 text-red-400 border border-red-900/50 uppercase">
                              {target.vulnerability}
                          </div>
                      </div>
                  </motion.div>
              ))}
          </div>
      )}

      {scannedTargets.length === 0 && (
         <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2 }}
            className="h-px bg-hunter/50 w-64 mt-8 overflow-hidden"
        />
      )}
    </div>
  );
}
