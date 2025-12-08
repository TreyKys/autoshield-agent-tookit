import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HandCoins, TrendingUp, ShieldCheck, Database, ShoppingCart, Calculator } from 'lucide-react';
import curesData from '../../data/cures';
import targetsData from '../../data/targets';

interface BrokerProps {
  agentMessage?: string;
}

// Pricing Menu (Mock Prices in HBAR)
const PRICING = {
    'upgrade': 50, // 50 HBAR for full upgrade
    'pause': 10    // 10 HBAR for emergency pause
};

const TREASURY_ACCOUNT = "0.0.7160195";

export function Broker({ agentMessage }: BrokerProps) {
  const [totalCost, setTotalCost] = useState(0);
  const [gasEstimate, setGasEstimate] = useState(0);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    calculateBill();
  }, []);

  const calculateBill = () => {
    // 1. Identify work items from targets
    const workItems = targetsData.contracts.map(t => {
        const action = (t as any).action || 'upgrade';
        const price = PRICING[action as keyof typeof PRICING] || 0;
        return {
            ...t,
            action,
            price
        };
    });

    setItems(workItems);

    // 2. Calculate Subtotal
    const subtotal = workItems.reduce((acc, item) => acc + item.price, 0);

    // 3. Estimate Gas (Mocked but dynamic based on count)
    // Base gas ~ 0.5 HBAR per tx + overhead
    const estimatedGas = workItems.length * 0.85;
    setGasEstimate(estimatedGas);

    // 4. Total
    setTotalCost(subtotal + estimatedGas);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-broker w-full max-w-5xl mx-auto p-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-4 relative"
      >
        <div className="absolute inset-0 bg-broker/20 blur-2xl rounded-full" />
        <HandCoins className="w-16 h-16 relative z-10" />
      </motion.div>

      <h2 className="text-2xl font-display mb-2 uppercase tracking-widest">Negotiating Security Contract...</h2>
      <p className="text-broker/60 font-mono text-sm mb-6">Treasury: {TREASURY_ACCOUNT}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-4">
          {/* Itemized Bill */}
          <div className="glass-panel rounded-xl border-broker/30 p-4 max-h-[350px] overflow-y-auto custom-scrollbar">
             <div className="flex items-center justify-between gap-2 mb-4 text-white/80 border-b border-white/10 pb-2">
                 <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-broker" />
                    <span className="font-bold text-xs uppercase">Service Menu</span>
                 </div>
                 <span className="text-[10px] text-white/40">Itemized Breakdown</span>
             </div>
             <div className="space-y-3">
                 {items.map((item, idx) => (
                     <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between text-xs p-2 bg-white/5 rounded"
                     >
                         <div className="flex flex-col">
                            <span className="text-white/90 font-mono font-bold">{item.name}</span>
                            <span className="text-white/50 text-[10px] uppercase">{item.action} Patch</span>
                         </div>
                         <div className="font-mono text-broker">
                             {item.price} HBAR
                         </div>
                     </motion.div>
                 ))}

                 <div className="flex items-center justify-between text-xs p-2 mt-4 border-t border-white/10 pt-4">
                     <div className="flex items-center gap-2 text-white/60">
                         <Calculator className="w-3 h-3" />
                         <span>Est. Network Gas</span>
                     </div>
                     <span className="font-mono text-white/60">{gasEstimate.toFixed(4)} HBAR</span>
                 </div>
             </div>
          </div>

          {/* Final Total */}
          <div className="glass-panel rounded-xl border-broker/30 p-6 flex flex-col justify-center items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck className="w-32 h-32" />
            </div>

            <div className="flex items-center justify-between gap-8 mb-2 w-full relative z-10">
                <span className="text-white/60 text-xs uppercase tracking-wider">Total Payable Amount</span>
                <TrendingUp className="w-4 h-4 text-broker" />
            </div>

            <div className="text-6xl font-mono font-bold text-white flex items-baseline gap-2 relative z-10 my-8">
                {totalCost.toFixed(2)} <span className="text-xl text-broker font-sans">HBAR</span>
            </div>

            <div className="w-full relative z-10">
                 <div className="flex justify-between text-[10px] text-white/40 mb-1">
                     <span>Treasury Routing</span>
                     <span>Verified</span>
                 </div>
                 <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-broker"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5 }}
                    />
                 </div>
            </div>

            <div className="mt-6 text-[10px] text-emerald-400 bg-emerald-900/20 px-3 py-1 rounded border border-emerald-900/50 relative z-10">
                Awaiting Signature
            </div>
          </div>
      </div>
    </div>
  );
}
