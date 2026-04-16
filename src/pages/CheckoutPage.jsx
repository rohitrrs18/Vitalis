import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CreditCard, Smartphone, CheckCircle2, ShieldCheck, ArrowLeft, Command } from 'lucide-react';

const CheckoutPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { medicines, bookMedicine } = useStore();
  
  const [step, setStep] = useState('summary'); // summary, payment, processing, success
  const [method, setMethod] = useState('');
  const [details, setDetails] = useState({ upiId: '', cardNumber: '', expiry: '', cvv: '' });

  const medicine = medicines.find(m => m.id === Number(id));
  const quantity = Number(searchParams.get('qty')) || 1;

  if (!medicine) return <div className="center-viewport"><h1>Asset Not Found</h1><button onClick={() => navigate('/user')} className="btn-airy">Return</button></div>;

  const total = medicine.price * quantity;

  const handleNext = async () => {
    if (step === 'summary') setStep('payment');
    else if (step === 'payment') {
      setStep('processing');
      try {
        // Simulate clinical authentication protocol offset
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const result = await bookMedicine(medicine.id, quantity);
        if (result.success) {
          setStep('success');
        } else {
          alert(`SETTLEMENT FAILED: ${result.error || 'Connection Timeout'}`);
          setStep('payment');
        }
      } catch (err) {
        console.error('Handshake Failure:', err);
        setStep('payment');
      }
    }
  };

  return (
    <div className="dashboard-section animate-reveal">
      <div className="noise-overlay" />
      <div className="grainy-bg" />
      
      <div className="spacious-container">
        {/* Navigation Breadcrumb */}
        <div className="w-full flex justify-start mb-4">
           <button onClick={() => navigate('/user')} className="flex items-center gap-3 text-white/30 hover:text-white transition-all group">
             <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
             <span className="uppercase tracking-widest text-[9px] font-black">Back to Marketplace</span>
           </button>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center">
          <p className="sub-label">Secure Settlement Hub</p>
          <h1>{step === 'success' ? 'Protocol Success.' : 'Finalize Asset.'}</h1>
          <p className="text-text-secondary text-xl max-w-xl mt-8 font-medium">
             Complete the cryptographic handshake to secure your pharmaceutical allocation.
          </p>
        </div>

        <div className="w-full max-w-3xl mt-12">
          {step === 'summary' && (
            <div className="airy-card !p-16 space-y-12 animate-reveal">
              <div className="w-full flex flex-col items-center gap-10">
                 <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[24px] flex items-center justify-center">
                   <Command size={32} />
                 </div>
                 <div className="text-center">
                   <p className="sub-label !m-0 mb-2 opacity-40">Asset ID: {medicine.id}</p>
                   <h3 className="text-5xl font-black">{medicine.name}</h3>
                   <p className="text-lg text-text-secondary mt-2">{medicine.brand} Clinical Solutions</p>
                 </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-8 py-12 border-y border-white/5">
                 <div className="text-center">
                   <p className="sub-label !text-[8px] !m-0 opacity-40 mb-2">Quantity Secured</p>
                   <p className="text-4xl font-black">X{quantity}</p>
                 </div>
                 <div className="text-center">
                   <p className="sub-label !text-[8px] !m-0 opacity-40 mb-2">Total Settlement</p>
                   <p className="text-4xl font-black text-green-500">${total}</p>
                 </div>
              </div>

              <button className="btn-airy !max-w-none py-8 !rounded-[32px] text-lg" onClick={handleNext}>
                PROCEED TO PAYMENT TERMINAL
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="airy-card !p-16 space-y-12 animate-reveal">
              <div className="w-full text-center">
                 <p className="sub-label mb-8">Select Payment Protocol</p>
                 <div className="payment-selector">
                    <button 
                      className={`payment-method-btn ${method === 'upi' ? 'active' : ''}`}
                      onClick={() => setMethod('upi')}
                    >
                      <Smartphone size={32} />
                      <span>UPI Integrated</span>
                    </button>
                    <button 
                      className={`payment-method-btn ${method === 'card' ? 'active' : ''}`}
                      onClick={() => setMethod('card')}
                    >
                      <CreditCard size={32} />
                      <span>Credit Token</span>
                    </button>
                 </div>
              </div>

              {method === 'upi' && (
                <div className="w-full space-y-6 animate-reveal">
                  <div className="text-center">
                    <label className="sub-label block text-center mb-4">Enter UPI Identifier</label>
                    <input 
                      className="input-airy !max-w-none !text-center !text-2xl font-black py-8" 
                      placeholder="user@bank-gateway" 
                      value={details.upiId}
                      onChange={e => setDetails({...details, upiId: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {method === 'card' && (
                <div className="w-full grid grid-cols-2 gap-8 animate-reveal">
                  <div className="col-span-2 text-center space-y-4">
                    <label className="sub-label block mb-2">Card Credentials</label>
                    <input 
                      className="input-airy !max-w-none !text-center font-black" 
                      placeholder="0000 0000 0000 0000"
                      value={details.cardNumber}
                      onChange={e => setDetails({...details, cardNumber: e.target.value})}
                    />
                  </div>
                  <div className="text-center space-y-4">
                    <label className="sub-label block mb-2">Expiry</label>
                    <input 
                      className="input-airy !max-w-none !text-center font-black" 
                      placeholder="MM/YY"
                      value={details.expiry}
                      onChange={e => setDetails({...details, expiry: e.target.value})}
                    />
                  </div>
                  <div className="text-center space-y-4">
                    <label className="sub-label block mb-2">Security</label>
                    <input 
                      className="input-airy !max-w-none !text-center font-black" 
                      placeholder="***"
                      value={details.cvv}
                      onChange={e => setDetails({...details, cvv: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <button 
                className={`btn-airy !max-w-none py-8 !rounded-[32px] ${!method ? 'opacity-20 pointer-events-none' : ''}`}
                onClick={handleNext}
              >
                INITIALIZE SETTLEMENT
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="airy-card !p-32 flex flex-col items-center gap-12 animate-reveal">
              <div className="pulse-auth" />
              <div className="text-center">
                <p className="sub-label animate-pulse">Authenticating Handshake</p>
                <h4 className="text-3xl font-black mt-4">Encrypted processing...</h4>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="airy-card !p-20 flex flex-col items-center gap-12 animate-reveal text-center">
              <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-black shadow-[0_0_80px_rgba(255,255,255,0.2)]">
                <ShieldCheck size={56} />
              </div>
              <div className="space-y-6">
                <h4 className="text-5xl font-black">Asset Secured.</h4>
                <p className="text-text-secondary text-lg max-w-sm mx-auto">The pharmaceutical allocation has been validated and added to the secure ledger.</p>
              </div>
              <button className="btn-airy !max-w-none py-8 !rounded-[32px]" onClick={() => navigate('/user')}>
                RETURN TO TERMINAL
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
