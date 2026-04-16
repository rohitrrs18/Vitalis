import React from 'react';
import { useStore } from '../context/StoreContext';
import { LogOut, User, Command, Zap } from 'lucide-react';

const Header = () => {
  const { user, logout } = useStore();

  return (
    <div className="w-full max-w-[1400px] mx-auto px-10 mt-12 mb-4 animate-reveal">
      <header className="airy-card !flex-row !justify-between !items-center !py-8 !px-12 !gap-0 !rounded-full shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <Command size={24} className="text-black" />
          </div>
          <div className="text-left">
             <h1 className="text-2xl font-black tracking-tight leading-none mb-1">VITALIS</h1>
             <p className="sub-label !text-[7px] !tracking-[0.3em] !m-0 opacity-50">Control Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
               <p className="text-sm font-black leading-none mb-1">{user.name}</p>
               <p className="sub-label !text-[7px] !m-0 opacity-40">{user.role}</p>
            </div>
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
               <User size={20} className="text-white/40" />
            </div>
          </div>
          
          <div className="h-10 w-[1px] bg-white/10 hidden md:block" />

          <button 
            onClick={logout}
            className="btn-airy !py-4 !px-10 !text-[10px] !w-auto shadow-2xl"
          >
            <LogOut size={18} />
            <span>Terminate Session</span>
          </button>
        </div>
      </header>
    </div>
  );
};

export default Header;
