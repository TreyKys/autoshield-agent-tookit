import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radar, Search, ShieldAlert, CheckCircle, Loader2 } from 'lucide-react';
import { fetchContractsByAccount, fetchContractBytecode } from '../../lib/mirror-node';
import { BytecodeScanner } from '../../lib/scanner';
import { useActiveAccount } from "thirdweb/react";

interface HunterProps {
  onComplete: (targets: any[]) => void;
  // Optional props for compatibility or future use
  agentMessage?: string;
  onTargetsFound?: (targets: any[]) => void;
}

export function Hunter({ onComplete }: HunterProps) {
  const account = useActiveAccount();
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing Hunter Protocol...");
  const [discovered, setDiscovered] = useState<any[]>([]);
  const [scannedCount, setScannedCount] = useState(0);

  const startScan = async () => {
    if (!account) return;

    setScanning(true);
    setDiscovered([]);
    setScannedCount(0);
    setScanProgress(10);
    setStatusText(`Querying Hedera Mirror Node for Account ${account.address}...`);

    try {
        // 1. Discovery
        const contracts = await fetchContractsByAccount(account.address);

        if (contracts.length === 0) {
            setStatusText("No recent contract deployments found.");
            setScanProgress(100);
            setScanning(false);
            return;
        }

        setStatusText(`Found ${contracts.length} contracts. Analyzing Bytecode...`);
        const targets: any[] = [];
        const step = 90 / contracts.length;

        // 2. Analysis
        for (let i = 0; i < contracts.length; i++) {
            const contract = contracts[i];
            const bytecode = await fetchContractBytecode(contract.evm_address);

            if (bytecode) {
                const scanResult = BytecodeScanner.scan(bytecode);
                if (scanResult.isVulnerable) {
                    targets.push({
                        id: contract.contract_id,
                        name: `Target-${contract.contract_id.split('.').pop()}`,
                        address: contract.evm_address,
                        risk: 'High',
                        type: scanResult.vulnerabilityType,
                        action: scanResult.action || 'upgrade',
                        scannedAt: new Date().toISOString()
                    });
                }
            }
            setScannedCount(prev => prev + 1);
            setScanProgress(prev => prev + step);
        }

        setDiscovered(targets);
        setStatusText(`Scan Complete. Identified ${targets.length} threats.`);
        setScanProgress(100);

        // Auto-proceed after a delay if targets found
        if (targets.length > 0) {
            setTimeout(() => {
                onComplete(targets);
            }, 2000);
        } else {
             setScanning(false);
        }

    } catch (error) {
        console.error("Scan failed:", error);
        setStatusText("Scan failed due to network error.");
        setScanning(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-hunter relative overflow-hidden">
      {/* Background Radar Animation */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
         <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-[600px] h-[600px] border border-hunter rounded-full border-dashed"
         />
         <motion.div
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute w-[400px] h-[400px] bg-hunter/5 rounded-full blur-3xl"
         />
      </div>

      <div className="z-10 flex flex-col items-center max-w-lg w-full">
        <div className="mb-8 relative">
            <div className="absolute inset-0 bg-hunter/20 blur-xl rounded-full animate-pulse" />
            <Radar className={`w-20 h-20 ${scanning ? 'animate-spin-slow' : ''}`} />
        </div>

        <h2 className="text-3xl font-display mb-2">
            {scanning ? "Scanning Network..." : "Network Watchdog Active"}
        </h2>

        <p className="text-white/60 text-center mb-8 h-6 font-mono text-sm">
            {statusText}
        </p>

        {!scanning && discovered.length === 0 && (
            <div className="space-y-4 w-full">
                {!account ? (
                     <div className="p-4 border border-white/10 rounded bg-black/20 text-center text-white/50">
                        Connect Wallet to Scan
                     </div>
                ) : (
                    <button
                        onClick={startScan}
                        className="w-full py-4 bg-hunter/10 border border-hunter/50 hover:bg-hunter/20 text-hunter font-bold rounded uppercase tracking-widest transition-all flex items-center justify-center gap-2 group"
                    >
                        <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Initiate Deep Scan
                    </button>
                )}
            </div>
        )}

        {/* Scan Progress UI */}
        {scanning && (
            <div className="w-full space-y-2">
                <div className="flex justify-between text-xs uppercase text-hunter/70 font-mono">
                    <span>Progress</span>
                    <span>{Math.round(scanProgress)}%</span>
                </div>
                <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-white/10">
                    <motion.div
                        className="h-full bg-hunter"
                        initial={{ width: 0 }}
                        animate={{ width: `${scanProgress}%` }}
                    />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="p-3 bg-black/30 border border-white/5 rounded text-center">
                        <div className="text-2xl font-display text-white">{scannedCount}</div>
                        <div className="text-xs text-white/40 uppercase">Contracts Analyzed</div>
                    </div>
                    <div className="p-3 bg-black/30 border border-hunter/30 rounded text-center">
                        <div className="text-2xl font-display text-hunter">{discovered.length}</div>
                        <div className="text-xs text-hunter/60 uppercase">Vulnerabilities</div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
