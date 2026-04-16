import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { 
  Plus, Search, Package, ShoppingCart, AlertTriangle, 
  Scan, Trash2, Activity, DollarSign, Database
} from 'lucide-react';

const AdminDashboard = () => {
  const { medicines, bookings, setMedicines, loading } = useStore();
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="center-viewport">
        <div className="grainy-bg" />
        <div className="noise-overlay" />
        <div className="flex flex-col items-center gap-8">
          <div className="w-16 h-16 border-4 border-white/5 border-t-white rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.5rem] opacity-40">Authenticating Global Ledger...</p>
        </div>
      </div>
    );
  }

  const lowStock = medicines.filter(m => m.stock < 10);
  const totalStock = medicines.reduce((acc, m) => acc + Number(m.stock), 0);
  const totalRevenue = bookings.reduce((acc, b) => {
    const med = medicines.find(m => m.id === b.medicineId);
    return acc + (med ? med.price * b.quantity : 0);
  }, 0);

  const deleteMedicine = (id) => {
    if(window.confirm('Terminate asset entry?')) {
        setMedicines(prev => prev.filter(m => m.id !== id));
    }
  };

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-section animate-reveal">
      <div className="noise-overlay" />
      <div className="grainy-bg" />
      
      <div className="spacious-container">
        {/* Admin Hero */}
        <div className="flex flex-col items-center text-center">
          <p className="sub-label">Operations Control</p>
          <h1>Management.</h1>
          <p className="text-text-secondary text-xl max-w-lg mt-8 font-medium">
            Oversee global inventory, monitor bookings, and authenticate medical assets with surgical precision.
          </p>
        </div>

        {/* Stats Bento */}
        <div className="airy-grid">
          <div className="airy-card !p-10 flex flex-col items-center">
            <Package size={32} className="text-white/20 mb-6" />
            <p className="sub-label !m-0 mb-2">Inventory Volume</p>
            <h4 className="text-5xl font-black">{totalStock}</h4>
            <span className="text-[10px] font-bold text-green-500 mt-4 tracking-widest uppercase">Live Tracking</span>
          </div>
          <div className="airy-card !p-10 flex flex-col items-center">
            <ShoppingCart size={32} className="text-white/20 mb-6" />
            <p className="sub-label !m-0 mb-2">Total Bookings</p>
            <h4 className="text-5xl font-black">{bookings.length}</h4>
            <span className="text-[10px] font-bold text-white/30 mt-4 tracking-widest uppercase">System Ledger</span>
          </div>
          <div className="airy-card !p-10 flex flex-col items-center">
            <AlertTriangle size={32} className={lowStock.length > 0 ? "text-orange-500 mb-6" : "text-white/20 mb-6"} />
            <p className="sub-label !m-0 mb-2">Restock Priority</p>
            <h4 className={`text-5xl font-black ${lowStock.length > 0 ? "text-orange-500" : ""}`}>{lowStock.length}</h4>
            <span className="text-[10px] font-bold text-white/30 mt-4 tracking-widest uppercase">Limit Alerts</span>
          </div>
          <div className="airy-card !p-10 !bg-white flex flex-col items-center">
            <DollarSign size={32} className="text-black/20 mb-6" />
            <p className="sub-label !m-0 !text-black/40 mb-2">Gross Value</p>
            <h4 className="text-5xl font-black text-black">${totalRevenue}</h4>
            <span className="text-[10px] font-bold text-black/50 mt-4 tracking-widest uppercase">Net Projection</span>
          </div>
        </div>

        {/* Navigation Tab Bar */}
        <div className="flex gap-8 justify-center py-4 border-y border-white/5 w-full">
          <button 
            className={`px-10 py-4 rounded-2xl font-black text-sm transition-all ${activeTab === 'inventory' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
            onClick={() => setActiveTab('inventory')}
          >
            SYSTEM INVENTORY
          </button>
          <button 
            className={`px-10 py-4 rounded-2xl font-black text-sm transition-all ${activeTab === 'bookings' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
            onClick={() => setActiveTab('bookings')}
          >
            TRANSACTION LOGS
          </button>
        </div>

        {activeTab === 'inventory' ? (
          <div className="w-full space-y-16">
            <div className="flex flex-col items-center gap-12">
              <div className="relative w-full max-w-2xl group">
                <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-white transition-colors" size={24} />
                <input 
                  type="text" 
                  className="input-airy !max-w-none !pl-24 !py-8 !text-left !rounded-full border-white/5 focus:border-white/20 bg-white/[0.02]" 
                  placeholder="Filter asset database by name or identifier..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Side-by-Side Operational Buttons */}
              <div className="flex gap-8 w-full max-w-2xl">
                <button 
                  className="btn-airy !py-6 flex-1 shadow-2xl !rounded-3xl group" 
                  onClick={() => navigate('/admin/scanner')}
                >
                  <Scan size={20} className="group-hover:rotate-12 transition-transform" /> 
                  <span>HARDWARE SCANNER</span>
                </button>
                <button 
                  className="btn-airy !py-6 flex-1 shadow-2xl !rounded-3xl group" 
                  onClick={() => navigate('/admin/add-asset')}
                >
                  <Plus size={20} className="group-hover:scale-125 transition-transform" /> 
                  <span>NEW ASSET REGISTRY</span>
                </button>
              </div>
            </div>

            <div className="airy-grid">
              {filteredMedicines.map(m => (
                <div key={m.id} className="airy-card !p-8 flex flex-col items-center group relative overflow-hidden h-full">
                  {/* Visual Background Flair */}
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-all" />

                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-[20px] flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black transition-all duration-700">
                     <Database size={24} />
                  </div>

                  <div className="text-center w-full flex flex-col items-center">
                     <h3 className="text-xl font-black mb-1">{m.name}</h3>
                     <div className="flex items-center justify-center gap-2 mb-6">
                        <Activity size={12} className="text-white/40" />
                        <p className="sub-label !text-[7px] !m-0 !tracking-[0.1em]">{m.brand} • {m.category}</p>
                     </div>
                     
                     <div className="w-full grid grid-cols-2 gap-px bg-white/5 border-y border-white/5 py-4 mb-6">
                        <div>
                           <p className="sub-label !text-[6px] !m-0 opacity-40 mb-1">Valuation</p>
                           <p className="text-lg font-black">${m.price}</p>
                        </div>
                        <div>
                           <p className="sub-label !text-[6px] !m-0 opacity-40 mb-1">Reserve</p>
                           <p className={`text-lg font-black ${m.stock < 10 ? 'text-orange-500' : ''}`}>{m.stock}</p>
                        </div>
                     </div>

                     <div className="flex justify-center items-center gap-4 mt-auto">
                        <div className="flex items-center gap-1.5">
                           <div className="w-1 h-1 rounded-full bg-white/20" />
                           <code className="text-[8px] font-mono tracking-widest text-white/40 uppercase">{m.barcode}</code>
                        </div>
                        <div className="h-3 w-px bg-white/10" />
                        <button onClick={() => deleteMedicine(m.id)} className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-white/30 hover:text-red-500 transition-colors group/del">
                          <Trash2 size={12} className="group-hover/del:scale-110 transition-transform" />
                          <span>Terminate</span>
                        </button>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="airy-card !p-0 overflow-hidden border-none w-full shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5">
                    <th className="p-8 sub-label !m-0">TRACE ID</th>
                    <th className="p-8 sub-label !m-0">OPERATOR</th>
                    <th className="p-8 sub-label !m-0">ASSIGNED ASSET</th>
                    <th className="p-8 sub-label !m-0 text-center">UNITS</th>
                    <th className="p-8 sub-label !m-0 text-right">DATE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-8 font-mono text-xs text-text-secondary tracking-widest uppercase">#{b.id.toString().slice(-10)}</td>
                      <td className="p-8 font-black">{b.userName}</td>
                      <td className="p-8 text-sm font-bold text-white/60">{b.medicineName}</td>
                      <td className="p-8 font-black text-center">{b.quantity}</td>
                      <td className="p-8 text-right text-text-secondary text-xs font-black">{b.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && (
                <div className="p-24 text-center opacity-30">
                  <p className="text-xl font-medium tracking-[0.4rem]">LEDGER EMPTY</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
