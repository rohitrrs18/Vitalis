import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, PackagePlus, ShieldCheck, Database } from 'lucide-react';

const AddAssetPage = () => {
  const { addMedicine } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [newMedicine, setNewMedicine] = useState({
    name: '', brand: '', price: '', stock: '', barcode: '', category: ''
  });

  useEffect(() => {
    // Parse barcode from URL if redirected from scanner
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    if (code) {
      setNewMedicine(prev => ({ ...prev, barcode: code }));
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await addMedicine({ 
      ...newMedicine, 
      price: Number(newMedicine.price), 
      stock: Number(newMedicine.stock) 
    });
    
    if (result.success) {
      navigate('/admin');
    } else {
      alert(`ACQUISITION ERROR: ${result.error}`);
    }
  };

  return (
    <div className="dashboard-section animate-reveal">
      <div className="noise-overlay" />
      <div className="grainy-bg" />
      
      <div className="spacious-container">
        {/* Header Actions */}
        <div className="w-full flex justify-between items-center mb-16">
          <button 
            onClick={() => navigate('/admin')}
            className="w-16 h-16 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all group"
          >
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center gap-4">
            <PackagePlus size={20} className="text-white/40" />
            <p className="sub-label !m-0 tracking-[0.4rem]">Asset Acquisition</p>
          </div>
          <div className="w-16" />
        </div>

        <div className="flex flex-col items-center">
          <div className="text-center mb-16">
            <h1>New Registry.</h1>
            <p className="text-text-secondary text-xl max-w-lg mt-8 font-medium mx-auto">
              Link a new medical asset to the global inventory database with full surgical compliance.
            </p>
          </div>

          <div className="w-full max-w-2xl">
            <div className="airy-card !bg-black border-white/20 shadow-[0_0_100px_rgba(255,255,255,0.05)]">
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-10 w-full">
                <div className="col-span-2 space-y-4">
                  <label className="sub-label block text-left flex items-center gap-2">
                    <Database size={12} className="opacity-40" /> Internal Designation
                  </label>
                  <input required className="input-airy !max-w-none !text-left" value={newMedicine.name} onChange={e => setNewMedicine({...newMedicine, name: e.target.value})} placeholder="e.g. Paracetamol L4" />
                </div>
                
                <div className="space-y-4 text-left">
                  <label className="sub-label block text-left">Manufacturer</label>
                  <input required className="input-airy !max-w-none !text-left" value={newMedicine.brand} onChange={e => setNewMedicine({...newMedicine, brand: e.target.value})} />
                </div>
                <div className="space-y-4 text-left">
                  <label className="sub-label block text-left">Classification</label>
                  <input required className="input-airy !max-w-none !text-left" value={newMedicine.category} onChange={e => setNewMedicine({...newMedicine, category: e.target.value})} />
                </div>
                
                <div className="space-y-4 text-left">
                  <label className="sub-label block text-left">Unit Value ($)</label>
                  <input required type="number" className="input-airy !max-w-none !text-left" value={newMedicine.price} onChange={e => setNewMedicine({...newMedicine, price: e.target.value})} />
                </div>
                <div className="space-y-4 text-left">
                  <label className="sub-label block text-left">Initial Reserve</label>
                  <input required type="number" className="input-airy !max-w-none !text-left" value={newMedicine.stock} onChange={e => setNewMedicine({...newMedicine, stock: e.target.value})} />
                </div>
                
                <div className="col-span-2 space-y-4 text-left">
                  <label className="sub-label block text-left flex items-center gap-2">
                    <ShieldCheck size={12} className="opacity-40" /> Authentication ID (Barcode)
                  </label>
                  <input required className="input-airy !max-w-none !text-left font-mono" value={newMedicine.barcode} onChange={e => setNewMedicine({...newMedicine, barcode: e.target.value})} />
                </div>
                
                <div className="col-span-2 pt-8">
                  <button type="submit" className="btn-airy !max-w-none">INITIALIZE PROTOCOL</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAssetPage;
