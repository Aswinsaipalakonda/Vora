import React, { useState, useEffect } from 'react';

interface PremiumLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

const MESSAGES = [
  "Initializing Luxury Platform...",
  "Curating your experience...",
  "Synchronizing data...",
  "Preparing your workspace...",
];

const PremiumLoader: React.FC<PremiumLoaderProps> = ({ message, fullScreen = true }) => {
  const [displayMsg, setDisplayMsg] = useState(message || MESSAGES[0]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % MESSAGES.length;
      setDisplayMsg(MESSAGES[index]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const LoaderContent = (
    <div className="flex flex-col items-center justify-center z-50">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
        {/* Single Ambient Blob */}
        <div className="absolute w-[600px] h-[600px] bg-rose-400/10 rounded-full blur-[200px] animate-pulse duration-[3000ms]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-12">
        {/* Horizontal Logo Lockup */}
        <div className="flex items-center gap-4">
          {/* Logo Container - Static */}
          <div className="relative">
            {/* Main Logo Box */}
            <div className="relative w-12 h-12 bg-white rounded-[1rem] flex items-center justify-center shadow-2xl">
              {/* Inner Diamond - Static */}
              <div className="relative w-5 h-5 flex items-center justify-center">
                <div className="absolute inset-0 bg-black rounded-md rotate-45 shadow-lg"></div>
              </div>
            </div>
          </div>

          {/* Brand Name */}
          <h1 className="text-5xl font-bold tracking-tighter text-white" style={{ fontWeight: '500' }}>
            Vora
          </h1>
        </div>

        {/* Status Message (Below the row) */}
        <div className="flex flex-col items-center gap-4 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-500 fill-mode-both">
          <p
            key={displayMsg}
            className="text-xs font-medium text-rose-200/60 uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-1 duration-700"
          >
            {displayMsg}
          </p>

          {/* Sophisticated Progress Line */}
          <div className="h-[2px] w-24 bg-white/10 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-400/50 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[999] bg-[#050505] flex items-center justify-center overflow-hidden">
        {/* Subtle Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
        {LoaderContent}
      </div>
    );
  }

  return (
    <div className="w-full py-24 flex items-center justify-center bg-[#050505] rounded-2xl relative overflow-hidden ring-1 ring-white/10">
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
      {LoaderContent}
    </div>
  );
};

export default PremiumLoader;
