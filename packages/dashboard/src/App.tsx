import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Hero } from './components/Hero';
import { Hunter } from './components/Hunter';
import { Broker } from './components/Broker';
import { Surgeon } from './components/Surgeon';
import { Brain } from './components/Brain';
import { AnimatePresence, motion } from 'framer-motion';
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { createThirdwebClient } from 'thirdweb';
import { callAgent } from './services/agent-client';

// Client for ConnectButton
const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || "demo",
});

function App() {
  const [activeTab, setActiveTab] = useState('shield');
  const [act, setAct] = useState<'inactive' | 'hunter' | 'broker' | 'surgeon' | 'brain'>('inactive');
  const [txData, setTxData] = useState({ hash: '', impl: '' });
  const account = useActiveAccount();

  const handleActivate = async () => {
    // Call the NullShot Agent
    try {
        await callAgent("Auto-Shield, secure the network");
    } catch (error) {
        console.error("Failed to activate agent:", error);
    }

    // Start Sequence
    setAct('hunter');

    // Act 1: Hunter (Scanning) -> 2.5s
    setTimeout(() => {
        setAct('broker');
    }, 2500);

    // Act 2: Broker (Negotiating) -> 2.5s
    setTimeout(() => {
        setAct('surgeon');
    }, 5000);

    // Act 3: Surgeon is manual/interactive (needs sign), so it doesn't auto-transition until completion
  };

  const handleSurgeryComplete = (hash: string, impl: string) => {
    setTxData({ hash, impl });
    // Transition to Brain
    setTimeout(() => {
        setAct('brain');
    }, 1000);
  };

  const handleReset = () => {
    setAct('inactive');
    setTxData({ hash: '', impl: '' });
  };

  return (
    <div className="flex min-h-screen bg-midnight text-white font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} />

      <div className="flex-1 relative flex flex-col">
        {/* Header / Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-40">
           <div className="flex items-center gap-3">
               {/* Hamburger is in Sidebar, maybe put the Title here */}
               <h1 className="text-3xl font-bitcount font-bold tracking-widest pl-4">HUNT</h1>
           </div>

           <div>
               <ConnectButton client={client} theme="dark" />
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
                        className="w-full h-full"
                    >
                        <Hunter />
                    </motion.div>
                )}

                {act === 'broker' && (
                    <motion.div
                        key="broker"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="w-full h-full"
                    >
                        <Broker />
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
                        <Surgeon onComplete={handleSurgeryComplete} />
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
                        <Brain txHash={txData.hash} newImpl={txData.impl} onReset={handleReset} />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>

        {/* Cinematic Borders/Overlays can go here */}
      </div>
    </div>
  );
}

export default App;
