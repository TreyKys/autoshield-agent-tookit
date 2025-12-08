import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain as BrainIcon, Terminal, CheckCircle, Shield, History, Hash, Activity } from 'lucide-react';
import { Button } from './ui';

// HCS Topic ID from env or fallback
const HCS_TOPIC_ID = process.env.NEXT_PUBLIC_HCS_TOPIC_ID || "0.0.5369661";
const MIRROR_NODE_API = "https://testnet.mirrornode.hedera.com/api/v1";

interface BrainProps {
  onRestart: () => void;
  results: any[];
}

export function Brain({ onRestart, results }: BrainProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  // Fetch logs from HCS Topic
  useEffect(() => {
    const fetchLogs = async () => {
        try {
            const res = await fetch(`${MIRROR_NODE_API}/topics/${HCS_TOPIC_ID}/messages?limit=20&order=desc`);
            if (!res.ok) return;
            const data: any = await res.json();

            // Parse messages (base64 decode)
            const parsedLogs = data.messages.map((msg: any) => {
                try {
                    const decoded = atob(msg.message);
                    return JSON.parse(decoded);
                } catch (e) {
                    return { action: "RAW_MESSAGE", details: msg.message };
                }
            }).filter((l: any) => l.timestamp); // Basic filter

            setLogs(parsedLogs);
            setLoadingLogs(false);
        } catch (e) {
            console.error("Failed to fetch HCS logs:", e);
            setLoadingLogs(false);
        }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const successCount = results.filter(r => r.success || r.status === 'success').length;

  return (
    <div className="flex flex-col h-full text-brain overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-4 mb-6 p-4 border-b border-white/10">
         <div className="p-3 bg-brain/10 rounded-full">
            <BrainIcon className="w-8 h-8" />
         </div>
         <div>
            <h2 className="text-2xl font-display">Neural Memory</h2>
            <div className="text-xs text-white/50 font-mono">
                Topic ID: {HCS_TOPIC_ID} • Consensus Verified
            </div>
         </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden p-4">

          {/* Results Summary */}
          <div className="w-1/3 space-y-4">
              <div className="glass-panel border-brain/30 p-6 rounded-lg bg-brain/5">
                  <div className="text-sm text-white/50 uppercase tracking-wider mb-1">Mission Status</div>
                  <div className="text-4xl font-display text-white mb-4">
                      {successCount}/{results.length} Secured
                  </div>

                  <div className="space-y-2">
                      {results.map((r, i) => (
                          <div key={i} className="flex items-center justify-between text-xs p-2 bg-black/20 rounded border border-white/5">
                              <span className="font-mono text-white/70 truncate w-32">{r.name || r.address}</span>
                              <div className="flex items-center gap-1">
                                  {r.status === 'success' || r.success ? (
                                      <span className="text-brain flex items-center gap-1">
                                          <CheckCircle className="w-3 h-3" /> PATCHED
                                      </span>
                                  ) : (
                                      <span className="text-red-400">FAILED</span>
                                  )}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              <div className="p-4 bg-brain/10 border border-brain/20 rounded text-center">
                  <p className="text-sm text-white/70 mb-4">
                      The Agent has updated its global immunity database.
                  </p>
                  <Button onClick={onRestart} className="w-full bg-brain/20 hover:bg-brain/30 text-brain border border-brain/50">
                      Start New Cycle
                  </Button>
              </div>
          </div>

          {/* HCS Live Logs */}
          <div className="flex-1 glass-panel border-white/10 rounded-lg flex flex-col overflow-hidden bg-black/40">
              <div className="p-3 bg-black/40 border-b border-white/5 flex items-center justify-between">
                  <span className="text-xs font-mono text-white/50 flex items-center gap-2">
                      <Terminal className="w-4 h-4" />
                      LIVE HCS FEED
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-brain/70 bg-brain/10 px-2 py-1 rounded-full">
                      <Activity className="w-3 h-3 animate-pulse" />
                      SYNCED
                  </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2">
                  {loadingLogs ? (
                      <div className="text-center text-white/30 italic py-10">Syncing with Hedera Consensus Service...</div>
                  ) : logs.length === 0 ? (
                      <div className="text-center text-white/30 italic py-10">No recent activity recorded on chain.</div>
                  ) : (
                      logs.map((log, i) => (
                          <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                              <span className="text-white/30 shrink-0 w-20">{log.timestamp?.split('T')[1].split('.')[0]}</span>
                              <div className="flex-1">
                                  <span className={`uppercase font-bold mr-2 ${
                                      log.level === 'error' ? 'text-red-400' :
                                      log.level === 'success' ? 'text-brain' : 'text-blue-400'
                                  }`}>
                                      [{log.stage}]
                                  </span>
                                  <span className="text-white/80">{log.action}</span>
                                  {log.details && (
                                      <div className="mt-1 ml-2 text-white/40 pl-2 border-l border-white/10">
                                          {JSON.stringify(log.details)}
                                      </div>
                                  )}
                              </div>
                          </div>
                      ))
                  )}
              </div>
          </div>

      </div>
    </div>
  );
}
