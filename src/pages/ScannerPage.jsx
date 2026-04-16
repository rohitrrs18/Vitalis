import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Scan, ShieldAlert } from 'lucide-react';
import BarcodeScanner from '../components/BarcodeScanner';

const ScannerPage = () => {
  const { medicines } = useStore();
  const navigate = useNavigate();

  const handleScanSuccess = (code) => {
    const found = medicines.find(m => m.barcode === code);
    if (found) {
      // In a real app, we'd navigate to the asset detail or show a clean status
      alert(`Asset Authenticated: ${found.name}\nSystem Count: ${found.stock}`);
      navigate('/admin');
    } else {
      // Redirect to Add Asset with the scanned code
      navigate(`/admin/add-asset?code=${code}`);
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
            <Scan size={20} className="text-white/40" />
            <p className="sub-label !m-0 tracking-[0.4rem]">Operational Terminal</p>
          </div>
          <div className="w-16" /> {/* Spacer for balance */}
        </div>

        {/* Content Area */}
        <div className="flex flex-col items-center">
          <div className="text-center mb-20">
            <h1>Hardware Sync.</h1>
            <p className="text-text-secondary text-xl max-w-lg mt-8 font-medium mx-auto">
              Scan the pharmaceutical authentication code to verify asset status or initiate a new system entry.
            </p>
          </div>

          <div className="w-full max-w-2xl">
            <div className="airy-card !p-0 overflow-hidden relative border-white/20 shadow-[0_0_100px_rgba(255,255,255,0.05)]">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
               <BarcodeScanner 
                 onScanSuccess={handleScanSuccess} 
                 onClose={() => navigate('/admin')} 
               />
            </div>
            
            <div className="flex items-center justify-center gap-4 mt-12 opacity-40">
               <ShieldAlert size={16} />
               <p className="sub-label !m-0 !text-[10px]">Secure Authentication Protocol Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
