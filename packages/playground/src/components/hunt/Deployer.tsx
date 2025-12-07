import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Activity, Users, FileCode, Globe, Zap, ArrowRight, Construction } from 'lucide-react';

export function Deployer() {
  const features = [
    {
      title: 'Autonomous Proxy Upgrades',
      subtitle: 'The "Shape-Shifter"',
      icon: Layers,
      description: 'Currently, we are deploying patches. The future Deployer will fully automate EIP-1967 Transparent Proxy upgrades.',
      benefit: 'The user’s Contract ID remains the same. The "pill" changes, but the "patient" (address) stays the same.',
    },
    {
      title: '"Canary" Simulations',
      subtitle: 'The "Clinical Trial"',
      icon: Activity,
      description: 'Before the General makes a real change on Mainnet, it will run a simulation. The Deployer forks the current state of the blockchain locally, applies the patch, and runs a battery of tests.',
      benefit: 'It ensures the "cure" doesn\'t kill the patient (e.g., fixing a reentrancy bug doesn\'t accidentally lock all funds).',
    },
    {
      title: 'DAO Governance Integration',
      subtitle: 'The "Ethics Committee"',
      icon: Users,
      description: 'For high-value contracts, the General shouldn\'t act alone. Instead of deploying immediately, the General proposes a transaction to a Multi-Sig wallet or a Governance Timelock.',
      benefit: 'The AI Agents finds the fix, but humans (the board) must sign the transaction to administer it.',
    },
    {
      title: 'Natural Language Deployment',
      subtitle: 'The "Script"',
      icon: FileCode,
      description: 'You type: "Deploy a standard ERC-20 token named Integro with 1 million supply and a 2% tax."',
      benefit: 'The Deployer generates the Solidity code on the fly, compiles it, and deploys it to Hedera without you touching an IDE.',
    },
    {
      title: 'Cross-Chain Portability',
      subtitle: 'The "Franchise"',
      icon: Globe,
      description: 'If the Agent protects a dApp on Hedera, it can simultaneously deploy the security patch to the same dApp running on Ethereum or Polygon.',
      benefit: 'Unified security across all chains where the dApp lives.',
    },
  ];

  return (
    <div className="flex flex-col h-full w-full overflow-hidden p-8 relative">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header Section */}
      <div className="max-w-4xl mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/5 rounded border border-white/10">
              <Construction className="w-5 h-5 text-white/70" />
            </div>
            <span className="text-sm font-mono tracking-[0.2em] text-indigo-400 uppercase">Coming Soon</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
            Plans are already in place to make HUNT into a creator of smart contracts...
            <span className="text-white/40 block mt-2">not just a patch-up tool.</span>
          </h1>

          <p className="text-xl text-white/80 font-light border-l-2 border-indigo-500 pl-6 italic">
            "HUNT is the Future, not a Band-Aid"
          </p>
        </motion.div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8 overflow-y-auto pr-2 custom-scrollbar relative z-10">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-xl p-6 transition-all duration-300 hover:border-indigo-500/30 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <feature.icon className="w-24 h-24 text-white rotate-12 transform translate-x-4 -translate-y-4" />
            </div>

            <div className="relative z-10">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400 group-hover:text-indigo-300 group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-5 h-5" />
              </div>

              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-200 transition-colors">
                {feature.title}
              </h3>
              <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">
                {feature.subtitle}
              </p>

              <div className="space-y-3">
                <div className="text-sm text-white/70 leading-relaxed">
                  <span className="text-indigo-400 font-bold text-xs uppercase mr-2">The Feature</span>
                  {feature.description}
                </div>

                <div className="text-sm text-white/70 leading-relaxed pt-3 border-t border-white/5">
                  <span className="text-emerald-400 font-bold text-xs uppercase mr-2">The Benefit</span>
                  {feature.benefit}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Placeholder / Teaser Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center border border-white/5 border-dashed rounded-xl p-6 text-white/20"
        >
          <div className="text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <span className="text-xs uppercase tracking-widest">More Capabilities Loading...</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
