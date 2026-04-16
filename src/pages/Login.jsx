import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, User, ArrowRight, Lock, Command } from 'lucide-react';

const Login = () => {
  const { login } = useStore();
  const [role, setRole] = useState('user');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) return;

    if (role === 'admin') {
      if (name === 'admin' && password === 'admin123') {
        login(role, name);
      } else {
        setError('CRITICAL ACCESS DENIED: Invalid Administrative Credentials');
      }
    } else {
      login(role, name);
    }
  };

  return (
    <div className="center-viewport">
      <div className="grainy-bg" />
      <div className="noise-overlay" />
      
      <div className="spacious-container">
        {/* Top Branding Section */}
        <div className="animate-reveal flex flex-col items-center">
          <div className="w-20 h-20 bg-white rounded-[24px] mb-12 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)]">
            <Command size={40} className="text-black" />
          </div>
          <p className="sub-label">Vitalis Pharmaceutical Solutions</p>
          <h1>Secure.<br />Precise.<br />Digital.</h1>
          <p className="text-text-secondary text-lg max-w-sm mt-8 opacity-60">
            Advanced inventory orchestration for the modern clinical workspace.
          </p>
        </div>

        {/* Authentication Card */}
        <div className="airy-card animate-reveal !py-20" style={{ animationDelay: '0.2s' }}>
          <div className="w-full">
            <p className="sub-label !m-0 !mb-8">Identity Verification</p>
            <h2 className="text-4xl font-black text-white mb-2">Access Portal</h2>
          </div>

          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-24">
            <div className="role-group">
              <button
                type="button"
                className={`role-button ${role === 'user' ? 'active' : ''}`}
                onClick={() => { setRole('user'); setError(''); }}
              >
                <User size={32} />
                <span>Customer Entry</span>
              </button>
              <button
                type="button"
                className={`role-button ${role === 'admin' ? 'active' : ''}`}
                onClick={() => { setRole('admin'); setError(''); }}
              >
                <ShieldCheck size={32} />
                <span>Pharmacy Admin</span>
              </button>
            </div>

            <div className="w-full flex flex-col items-center gap-12 mt-12">
              <div className="w-full flex flex-col items-center gap-4">
                <label className="sub-label !tracking-[0.4rem] !m-0">Full Credential Entry</label>
                <input
                  type="text"
                  className={`input-airy ${error ? '!border-red-500/50' : ''}`}
                  placeholder={role === 'admin' ? "Operator ID (admin)" : "Type your name here"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {role === 'admin' && (
                <div className="w-full flex flex-col items-center gap-4 animate-reveal">
                  <label className="sub-label !tracking-[0.4rem] !m-0">Security Token</label>
                  <input
                    type="password"
                    className={`input-airy ${error ? '!border-red-500/50' : ''}`}
                    placeholder="Enter admin123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              )}
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 px-6 py-3 rounded-2xl animate-shake">
                  <p className="text-[10px] font-black text-red-500 tracking-widest uppercase">{error}</p>
                </div>
              )}
            </div>

            <div className="w-full flex justify-center mt-12">
              <button type="submit" className="btn-airy group">
                <span>Initialize Operations</span>
                <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </form>
        </div>


        {/* Minimal Footer */}
        <div className="animate-reveal opacity-20 flex flex-col items-center gap-2 py-12" style={{ animationDelay: '0.4s' }}>
           <p className="text-xs font-black uppercase tracking-[0.8rem]">VITALIS</p>
           <p className="text-[9px] font-bold uppercase tracking-[0.2rem]">Encrypted Secure Connection v2.4</p>
        </div>
      </div>
    </div>



  );
};

export default Login;
