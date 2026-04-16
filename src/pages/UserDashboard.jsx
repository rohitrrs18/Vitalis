import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingBag, Plus, Minus, Database, ShieldCheck } from 'lucide-react';

const UserDashboard = () => {
  const { medicines, loading } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingQty, setBookingQty] = useState({});
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="center-viewport">
        <div className="grainy-bg" />
        <div className="noise-overlay" />
        <div className="flex flex-col items-center gap-8">
          <div className="w-16 h-16 border-4 border-white/5 border-t-white rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.5rem] opacity-40">Initializing Inventory Database...</p>
        </div>
      </div>
    );
  }

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQtyChange = (id, delta, max) => {
    setBookingQty(prev => {
      const current = prev[id] || 1;
      const next = Math.max(1, Math.min(max, current + delta));
      return { ...prev, [id]: next };
    });
  };

  const handleOpenCheckout = (medicine) => {
    const qty = bookingQty[medicine.id] || 1;
    navigate(`/checkout/${medicine.id}?qty=${qty}`);
  };

  return (
    <div className="dashboard-section animate-reveal">
      <div className="noise-overlay" />
      <div className="grainy-bg" />
      
      <div className="spacious-container">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center">
          <p className="sub-label">Marketplace Terminal</p>
          <h1>Secure Selection.</h1>
          <p className="text-text-secondary text-xl max-w-xl mt-8 font-medium">
            Search our global clinical inventory and secure your high-value pharmaceutical assets.
          </p>
        </div>

        {/* Search Bar - Luxe */}
        <div className="w-full flex justify-center mb-12">
            <div className="relative w-full max-w-2xl group">
              <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-white transition-colors" size={24} />
              <input
                type="text"
                className="input-airy !max-w-none !pl-24 !py-8 !text-left !rounded-full border-white/5 focus:border-white/20 bg-white/[0.02]"
                placeholder="Query asset database by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
        </div>

        {/* Asset Inventory Grid */}
        <div className="w-full space-y-20">
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-4xl font-black tracking-tight">Active Inventory</h3>
            <p className="sub-label !m-0 opacity-40">System Synchronized • {filteredMedicines.length} Results</p>
          </div>

          <div className="airy-grid">
            {filteredMedicines.map(m => (
              <div key={m.id} className="airy-card !p-8 flex flex-col items-center group relative overflow-hidden h-full">
                {/* Visual Flair */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-all" />

                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-[20px] flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black transition-all duration-700">
                  <Database size={24} />
                </div>
                
                <h3 className="text-xl font-black mb-1">{m.name}</h3>
                <div className="flex items-center gap-2 mb-6">
                   <ShieldCheck size={12} className="text-white/40" />
                   <p className="sub-label !text-[7px] !m-0 !tracking-[0.1em]">{m.brand} • {m.category}</p>
                </div>

                {/* Data Matrix */}
                <div className="w-full grid grid-cols-2 gap-px bg-white/5 border-y border-white/5 py-6 mb-6">
                  <div className="flex flex-col items-center">
                    <p className="sub-label !text-[6px] !m-0 opacity-40 mb-1">Valuation</p>
                    <p className="text-xl font-black">${m.price}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="sub-label !text-[6px] !m-0 opacity-40 mb-1">Reserve</p>
                    <p className={`text-xl font-black ${m.stock < 10 ? 'text-orange-500' : ''}`}>{m.stock}</p>
                  </div>
                </div>

                <div className="w-full space-y-4 mt-auto">
                  {m.stock > 0 ? (
                    <>
                      <div className="qty-terminal mb-4">
                        <button onClick={() => handleQtyChange(m.id, -1, m.stock)} className="qty-btn">
                          <Minus size={14} />
                        </button>
                        <div className="flex flex-col items-center">
                          <span className="text-[6px] font-black uppercase tracking-widest text-white/30">Units</span>
                          <span className="font-black text-xl leading-none">{bookingQty[m.id] || 1}</span>
                        </div>
                        <button onClick={() => handleQtyChange(m.id, 1, m.stock)} className="qty-btn">
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <button
                        className="btn-airy !max-w-none"
                        onClick={() => handleOpenCheckout(m)}
                      >
                        <ShoppingBag size={14} />
                        <span>Initialize Protocol</span>
                      </button>
                    </>
                  ) : (
                    <div className="py-4 bg-white/5 rounded-xl border border-white/5 border-dashed">
                       <p className="sub-label !m-0 !text-[8px] font-medium">Depleted</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredMedicines.length === 0 && (
          <div className="airy-card py-24 opacity-30">
            <p className="text-xl font-medium tracking-widest">NO ASSETS DETECTED</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
