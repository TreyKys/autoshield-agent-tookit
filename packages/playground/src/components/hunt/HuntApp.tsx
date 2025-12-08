'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { loadAIModelConfig, getOrCreateProxyId, validateProxyId } from '../../lib/exports/storage';
import { Sidebar } from './Sidebar';
import { Hero } from './Hero';
import { Hunter } from './Hunter';
import { Broker } from './Broker';
import { Surgeon } from './Surgeon';
import { Brain } from './Brain';
import { AnimatePresence, motion } from 'framer-motion';
import { ConnectButton, useActiveAccount, ThirdwebProvider } from "thirdweb/react";
import { createThirdwebClient, defineChain } from 'thirdweb';

// Initialize Thirdweb client
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "c06411514757049826317b6a782b137a", // Fallback or env
});

// Define Hedera Testnet Chain (ID 296)
const hederaTestnet = defineChain({
  id: 296,
  name: "Hedera Testnet",
  nativeCurrency: { name: "HBAR", symbol: "HBAR", decimals: 18 },
  rpc: "https://testnet.hashio.io/api",
  testnet: true,
});

// Main component wrapped in Provider
export default function HuntApp() {
    return (
        <ThirdwebProvider>
            <HuntAppInner />
        </ThirdwebProvider>
    );
}

// Inner component that uses the hook
function HuntAppInner() {
  const [activeTab, setActiveTab] = useState('shield');
  const [act, setAct] = useState<'inactive' | 'hunter' | 'broker' | 'surgeon' | 'brain'>('inactive');
  const [txData, setTxData] = useState({ hash: '', impl: '' });
  const account = useActiveAccount();
  const [proxyId, setProxyId] = useState<string | null>(null);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [modelConfig, setModelConfig] = useState<any>(null);
  const [discoveredTargets, setDiscoveredTargets] = useState<any[]>([]);

  // Initialize MCP/Chat setup
  useEffect(() => {
    const pid = getOrCreateProxyId();
    setProxyId(pid);
    setChatSessionId(crypto.randomUUID());
    const config = loadAIModelConfig();
    setModelConfig(config);
  }, []);

  const { messages, append, status } = useChat({
    api: '/api/chat',
    body: {
      mcpProxyId: proxyId,
      mcpSessionId: chatSessionId,
      // Use defaults if config missing
      provider: modelConfig?.provider || 'anthropic',
      model: modelConfig?.model || 'claude-3-5-sonnet-20241022',
      enableMCPTools: true,
    },
    onFinish: (message) => {
        // Logic to transition states based on message content
        // For now, we'll replicate the narrative flow
        console.log("Agent finished:", message);

        const content = message.content.toLowerCase();

        // If we were in Hunter mode and agent finished scanning
        if (act === 'hunter') {
             // Optional: parse JSON if the agent returns structured data
             // setVulnerabilities(...)

             // Transition to Broker after a delay for effect
             setTimeout(() => setAct('broker'), 2000);
        }

        // If we were in Broker mode and agent finished proposal
        if (act === 'broker') {
            // Wait for user to accept -> Surgeon
            setTimeout(() => setAct('surgeon'), 2000);
        }
    }
  });

  const handleActivate = async () => {
    // if (!account) {
    //    alert("Please connect wallet first");
    //    return;
    // }

    // Start Sequence
    setAct('hunter');

    // Trigger Agent
    try {
        // Wait briefly for effect
        setTimeout(async () => {
             // We actually skip the 'Scan' phase of the Agent because the frontend already did it.
             // We tell the agent to proceed to Broker/Surgeon logic directly or contextually.
             // The prompt triggers the agent's persona.
             await append({
                role: 'user',
                content: "Auto-Shield, secure the network. Targets identified. Proceed to patch."
            });
        }, 500);

    } catch (error) {
        console.error("Failed to activate agent:", error);
        setAct('inactive');
    }
  };

  // Handlers for manual transitions if needed by "Next" buttons in demo flow
  // (In autonomous mode, the Agent drives it, but for the demo acts, we might want user clicks)

  const handleScanComplete = () => {
      setAct('broker');
  };

  const handleNegotiationComplete = () => {
      // This is the "ACTIVATE" moment
      setAct('surgeon');
      // Trigger the agent if not already triggered, or trigger specific phase
      append({
          role: 'user',
          content: "Negotiation complete. Authorized to execute upgrades."
      });
  };

  const handleSurgeryComplete = (hash: string, result: any) => {
    setTxData({ hash, impl: result });
    // Transition to Brain
    setTimeout(() => {
        setAct('brain');
    }, 1000);
  };

  const handleReset = () => {
    setAct('inactive');
    setTxData({ hash: '', impl: '' });
  };

  // Extract data from messages for components
  const lastAssistantMessage = messages.filter(m => m.role === 'assistant').pop()?.content || "";

  return (
        <div className="flex min-h-screen bg-midnight text-white font-sans overflow-hidden">
        <Sidebar activeTab={activeTab} />

        <div className="flex-1 relative flex flex-col">
            {/* Header / Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-40">
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bitcount font-bold tracking-widest pl-4">HUNT</h1>
            </div>

            <div>
                <ConnectButton
                    client={client}
                    theme="dark"
                    chains={[hederaTestnet]}
                />
            </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 relative flex items-center justify-center p-8">
                <AnimatePresence mode="wait">
                    {act === 'inactive' && (
                        <motion.div key="inactive" className="w-full h-full" exit={{ opacity: 0 }}>
                            <Hero onActivate={handleActivate} />
                        </motion.div>
                    )}

                    {act === 'hunter' && (
                        <motion.div
                            key="hunter"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="w-full h-full relative"
                        >
                            <Hunter
                                agentMessage={lastAssistantMessage}
                                onTargetsFound={setDiscoveredTargets}
                            />

                            {/* Manual Advance Button for Demo Control */}
                            <div className="absolute bottom-8 right-8">
                                <button
                                    onClick={handleScanComplete}
                                    className="px-6 py-2 bg-hunter/20 border border-hunter text-hunter hover:bg-hunter/40 transition-all rounded uppercase text-sm tracking-widest font-bold"
                                >
                                    Proceed to Negotiation &rarr;
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {act === 'broker' && (
                        <motion.div
                            key="broker"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="w-full h-full relative"
                        >
                            <Broker agentMessage={lastAssistantMessage} />

                            {/* "ACTIVATE" Button - The key trigger point */}
                            <div className="absolute bottom-8 right-8">
                                <button
                                    onClick={handleNegotiationComplete}
                                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-all rounded uppercase text-sm tracking-[0.2em] font-bold border border-white/10"
                                >
                                    ACTIVATE AUTO-SHIELD
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {act === 'surgeon' && (
                        <motion.div
                            key="surgeon"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="w-full h-full"
                        >
                            <Surgeon
                                onComplete={handleSurgeryComplete}
                            />
                        </motion.div>
                    )}

                    {act === 'brain' && (
                        <motion.div
                            key="brain"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="w-full h-full"
                        >
                            <Brain txHash={txData.hash} result={txData.impl} onReset={handleReset} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
        </div>
  );
}
