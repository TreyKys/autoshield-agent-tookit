import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scale, FileSignature, Coins, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Button } from './ui';

// Pricing Menu (Dynamic in a real app, hardcoded here as requested)
const PRICING = {
    upgrade: 50, // HBAR
    pause: 10,   // HBAR
    serviceFee: 5 // HBAR (Agent Fee)
};

// Mock Gas Estimation (In HBAR)
const GAS_ESTIMATES = {
    upgrade: 2.5,
    pause: 0.5,
    deploySafe: 5.0
};

interface BrokerProps {
  onComplete: (data: any) => void;
  targets: any[];
}

export function Broker({ onComplete, targets }: BrokerProps) {
  const [negotiating, setNegotiating] = useState(true);
  const [totalCost, setTotalCost] = useState(0);
  const [breakdown, setBreakdown] = useState<any[]>([]);
  const [gasTotal, setGasTotal] = useState(0);

  useEffect(() => {
    // Simulate negotiation/calculation delay
    const timer = setTimeout(() => {
        calculateQuote();
        setNegotiating(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [targets]);

  const calculateQuote = () => {
      let cost = 0;
      let gas = 0;
      const items = [];

      // 1. One-time Setup (Deploy Safe Impl) - applied once if upgrades exist
      const hasUpgrades = targets.some(t => t.action === 'upgrade');
      if (hasUpgrades) {
          gas += GAS_ESTIMATES.deploySafe;
          // Setup is free/included in service fee for this demo?
          // Or let's just charge gas.
      }

      targets.forEach(t => {
          const price = t.action === 'upgrade' ? PRICING.upgrade : PRICING.pause;
          const gasEst = t.action === 'upgrade' ? GAS_ESTIMATES.upgrade : GAS_ESTIMATES.pause;

          cost += price;
          gas += gasEst;

          items.push({
              id: t.id,
              action: t.action,
              price,
              gas: gasEst
          });
      });

      // Add Agent Service Fee
      cost += PRICING.serviceFee;

      setGasTotal(gas);
      setTotalCost(cost);
      setBreakdown(items);
  };

  const finalTotal = totalCost + gasTotal;

  return (
    <div className="flex flex-col items-center justify-center h-full text-broker">
      <div className="mb-6 relative">
        <div className="absolute inset-0 bg-broker/20 blur-xl rounded-full" />
        <Scale className="w-20 h-20 relative z-10" />
      </div>

      <h2 className="text-3xl font-display mb-2">
          {negotiating ? "Negotiating Bounty..." : "Proposal Ready"}
      </h2>

      {negotiating ? (
        <div className="flex flex-col items-center space-y-4 w-full max-w-md mt-8">
             <div className="flex items-center gap-2 text-white/50 text-sm font-mono">
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing complexity...
             </div>
             {/* Fake streaming text */}
             <div className="w-full h-32 bg-black/20 rounded p-4 font-mono text-xs text-broker/60 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none" />
                <p>{`> target_count: ${targets.length}`}</p>
                <p>{`> estimating_gas_overhead...`}</p>
                <p>{`> checking_treasury_rates...`}</p>
                <p>{`> applying_bulk_discount...`}</p>
             </div>
        </div>
      ) : (
        <div className="w-full max-w-md mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Invoice Card */}
            <div className="glass-panel border-broker/30 p-6 rounded-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 bg-broker/10 rounded-bl text-xs font-mono text-broker">
                    INVOICE #HUNT-{Math.floor(Math.random() * 1000)}
                </div>

                <div className="space-y-4 mt-2">
                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                        <span className="text-white/60">Vulnerability Patches ({targets.length})</span>
                        <span className="text-white font-mono">{totalCost - PRICING.serviceFee} ℏ</span>
                    </div>

                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                        <span className="text-white/60">Network Gas (Est.)</span>
                        <span className="text-white/80 font-mono italic">{gasTotal} ℏ</span>
                    </div>

                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                        <span className="text-white/60">Agent Service Fee</span>
                        <span className="text-white font-mono">{PRICING.serviceFee} ℏ</span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <span className="text-broker font-bold uppercase tracking-wider">Total</span>
                        <span className="text-3xl font-display text-broker">{finalTotal.toFixed(2)} ℏ</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <Button
                    variant="outline"
                    className="flex-1 border-white/20 hover:bg-white/5 text-white/60"
                    onClick={() => { /* Cancel? */ }}
                >
                    Reject
                </Button>
                <Button
                    className="flex-2 bg-broker hover:bg-broker/80 text-black font-bold flex items-center justify-center gap-2"
                    onClick={() => onComplete({
                        finalTotal,
                        breakdown,
                        gasTotal,
                        targets // Pass targets through
                    })}
                >
                    <FileSignature className="w-4 h-4" />
                    Sign & Authorize
                </Button>
            </div>

            <p className="text-center text-xs text-white/30 max-w-xs mx-auto">
                By signing, you authorize the NullShot Agent to execute the specified upgrades on your behalf.
            </p>
        </div>
      )}
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>;
}
