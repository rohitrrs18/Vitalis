import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Scan, X, Activity, Camera } from 'lucide-react';

const BarcodeScanner = ({ onScanSuccess, onClose }) => {
  const [scannedResult, setScannedResult] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      fps: 20,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0
    });

    scanner.render((decodedText) => {
      setScannedResult(decodedText);
      scanner.clear();
      onScanSuccess(decodedText);
    }, (error) => {
      // Intentionally silent
    });

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Scanner clear fail", err));
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-reveal">
      <div className="noise-overlay" />
      
      <div className="w-full max-w-2xl bento-card border-border-glass-bright !bg-black shadow-[0_0_100px_rgba(255,255,255,0.05)]">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
              <Scan size={24} className="text-black" />
            </div>
            <div>
              <p className="label-caps mb-1">Optical Authentication</p>
              <h3 className="text-3xl font-black">Scanner Integrated</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl border border-border-glass transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-8">
          <div className="relative overflow-hidden rounded-[32px] border-4 border-white/5 bg-white/5 aspect-square max-w-[400px] mx-auto shadow-2xl">
            <div id="reader" className="w-full h-full"></div>
            {/* Scanned Animation Overlay */}
            {!scannedResult && (
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-[2px] bg-white opacity-20 animate-bounce" />
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="bg-white/5 p-6 rounded-2xl border border-border-glass">
                <p className="label-caps !text-[8px] mb-2">Signal Status</p>
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${scannedResult ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                  <p className="font-bold text-sm tracking-tight">
                    {scannedResult ? `CAPTURED: ${scannedResult}` : 'SEARCHING FOR TOKEN...'}
                  </p>
                </div>
             </div>

             <div className="flex flex-col gap-3">
                <button 
                  className="btn-premium-outline !py-3 w-full"
                  onClick={() => onScanSuccess((Math.floor(Math.random() * 9000000000) + 1000000000).toString())}
                >
                  Bypass (Simulate)
                </button>
                <button className="btn-premium !py-3 w-full" onClick={onClose}>
                  Cancel Link
                </button>
             </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border-glass flex items-center justify-center gap-2 text-text-secondary">
          <Camera size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">Hardware: default_video_input</span>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
