import React from 'react';
import { Shield, Menu, LayoutDashboard, Settings, Activity } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
}

export function Sidebar({ activeTab }: SidebarProps) {
  return (
    <div className="w-20 h-screen bg-midnight/80 backdrop-blur-md border-r border-white/10 flex flex-col items-center py-6 z-50">
      <div className="mb-8 p-2">
         <Menu className="w-6 h-6 text-white/70 hover:text-white cursor-pointer" />
      </div>

      <div className="flex flex-col gap-6 w-full items-center">
        <div className={`p-3 rounded-xl transition-all duration-300 ${activeTab === 'shield' ? 'bg-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'text-white/40 hover:text-white/70'}`}>
          <Shield className="w-6 h-6" />
        </div>

        {/* Placeholder icons for other potential tabs */}
        {/* <div className="p-3 text-white/40 hover:text-white/70 transition-colors">
          <LayoutDashboard className="w-6 h-6" />
        </div>
        <div className="p-3 text-white/40 hover:text-white/70 transition-colors">
          <Activity className="w-6 h-6" />
        </div> */}
      </div>

      <div className="mt-auto mb-4">
        <Settings className="w-6 h-6 text-white/40 hover:text-white/70 cursor-pointer" />
      </div>
    </div>
  );
}
