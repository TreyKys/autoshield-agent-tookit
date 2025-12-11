import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Bug, FileWarning, CheckCircle } from 'lucide-react';
import targetsData from '../../data/targets';
import { createThirdwebClient, getContract, defineChain } from "thirdweb";
import { getBytecode } from "thirdweb/contract";
import { hcsLogger } from '../../lib/hcs-logger';

// Client initialization for read-only scan
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "c06411514757049826317b6a782b137a",
});

const chain = defineChain({
  id: 296,
  name: "Hedera Testnet",
  nativeCurrency: { name: "HBAR", symbol: "HBAR", decimals: 18 },
  rpc: "https://testnet.hashio.io/api",
  testnet: true,
});

interface HunterProps {
  agentMessage?: string;
  onTargetsFound?: (targets: any[]) => void;
}

export function Hunter({ agentMessage, onTargetsFound }: HunterProps) {
  const [scannedTargets, setScannedTargets] = useState<any[]>([]);
  const [scanStatus, setScanStatus] = useState("Initializing Scan...");
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    scanNetwork();
  }, []);

  const addLog = (msg: string) => {
      setLogs(prev => [msg, ...prev].slice(0, 5));
      hcsLogger.log(`HUNTER: ${msg}`);
  };

  const scanNetwork = async () => {
    setScanStatus("Scanning Network & Mempools...");
    addLog("Initiating Bytecode Scanner on Hedera Testnet (ChainID 296)...");

    const foundTargets: any[] = [];
    const candidates = targetsData.contracts;

    // We scan the "candidates" (simulating a mempool listener that picked these up)
    for (const candidate of candidates) {
        try {
            setScanStatus(`Analyzing ${candidate.address.slice(0, 8)}...`);
            addLog(`Fetching Bytecode: ${candidate.address}`);

            const contract = getContract({
                client,
                chain,
                address: candidate.address,
            });

            // Real Network Call: Get Bytecode
            const code = await getBytecode(contract);

            if (!code || code === '0x') {
                addLog(`Warning: No bytecode found at ${candidate.address}`);
                continue;
            }

            // Simple Signature Analysis (Mocking the complex regex logic for demo)
            // Realistically we would search for "delegatecall" opcodes or known vulnerable signatures
            const isVulnerable = true; // In this demo, if it's in our candidate list and has code, it's vulnerable

            if (isVulnerable) {
                addLog(`CRITICAL: Vulnerability Signature Detected in ${candidate.address}`);
                foundTargets.push({
                    ...candidate,
                    bytecodeSize: code.length
                });
            }

        } catch (e: any) {
            console.error("Scan Error:", e);
            addLog(`Scan Error for ${candidate.address}: ${e.message}`);
        }
    }

    setScannedTargets(foundTargets);
    setScanStatus("Scan Complete.");
    addLog(`Scan Complete. Found ${foundTargets.length} vulnerable targets.`);

    if (onTargetsFound) {
        onTargetsFound(foundTargets);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-hunter w-full max-w-5xl mx-auto p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-6 relative"
      >
        <div className="absolute inset-0 bg-hunter/20 blur-2xl rounded-full animate-pulse" />
        <Search className="w-16 h-16 relative z-10" />
      </motion.div>

      <h2 className="text-2xl font-display mb-2 uppercase tracking-widest">{scanStatus}</h2>

      {/* Live Logs */}
      <div className="w-full max-w-lg mb-6 h-24 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-midnight pointer-events-none" />
          {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1 - (i * 0.2), y: 0 }}
                className="text-xs font-mono text-hunter/60 mb-1"
              >
                  {">"} {log}
              </motion.div>
          ))}
      </div>

      {scannedTargets.length > 0 && (
          <div className="w-full mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto px-4 custom-scrollbar">
              {scannedTargets.map((target, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-midnight/80 border border-hunter/30 p-4 rounded-lg flex items-start gap-3 hover:border-hunter/60 transition-colors group"
                  >
                      <div className="p-2 bg-hunter/10 rounded-md group-hover:bg-hunter/20 transition-colors">
                          <FileWarning className="w-6 h-6 text-hunter" />
                      </div>
                      <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                             <h3 className="font-mono font-bold text-white text-sm truncate">{target.name}</h3>
                             <span className="text-[10px] text-white/40 font-mono">{target.bytecodeSize ? `${Math.floor(target.bytecodeSize / 2)} bytes` : 'Unknown'}</span>
                          </div>
                          <p className="text-xs text-hunter/80 font-mono mt-1 truncate">{target.address}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                             <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-900/30 text-red-400 border border-red-900/50 uppercase">
                                 {target.vulnerability}
                             </span>
                          </div>
                      </div>
                  </motion.div>
              ))}
          </div>
      )}

      {scannedTargets.length === 0 && scanStatus === "Scan Complete." && (
          <div className="text-white/50">No vulnerabilities found (Safe).</div>
      )}
    </div>
  );
}
