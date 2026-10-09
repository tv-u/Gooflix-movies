import React from 'react';
import { Sparkles, ExternalLink, X, ShieldCheck, Zap } from 'lucide-react';

interface SmartAdsterraProps {
  placement: 'leaderboard-728' | 'sidebar-300' | 'sticky-bottom' | 'in-feed';
  onClose?: () => void;
}

export const SmartAdsterra: React.FC<SmartAdsterraProps> = ({ placement, onClose }) => {
  if (placement === 'leaderboard-728') {
    return (
      <div className="w-full my-5 flex flex-col items-center justify-center px-4">
        <div className="text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-1 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Sponsored Smart Ad Network • 728x90 Ultra High Speed Node</span>
        </div>

        <div className="w-full max-w-[728px] h-[90px] rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#161825] to-red-950/40 border border-amber-500/40 p-3 sm:p-4 flex items-center justify-between gap-3 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center gap-3 z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
              <Zap className="w-5 h-5 fill-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-xs sm:text-sm">
                  ⚡ 10Gbps Dedicated Cinema Cloud Streaming
                </span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-400 text-black shadow">
                  VIP SPONSOR
                </span>
              </div>
              <p className="text-[11px] text-gray-300 mt-0.5 line-clamp-1">
                Zero ISP throttling, 4K HDR master feeds, and instant magnet link acceleration.
              </p>
            </div>
          </div>

          <a
            href="https://www.google.com/search?q=high+speed+vpn+streaming+unlimited"
            target="_blank"
            rel="noopener noreferrer"
            className="z-10 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/30 transition-all shrink-0 cursor-pointer"
          >
            <span>Activate 4K</span>
            <ExternalLink className="w-3 h-3 stroke-[3]" />
          </a>
        </div>
      </div>
    );
  }

  if (placement === 'sticky-bottom') {
    return (
      <div className="fixed bottom-14 md:bottom-3 left-2 right-2 md:left-auto md:right-6 md:w-96 z-40 bg-[#141624] border border-amber-500/40 rounded-2xl p-3 shadow-2xl shadow-black flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-400 text-black shrink-0">
            AD
          </span>
          <div className="truncate">
            <div className="text-xs font-bold text-white truncate">
              Adsterra High-Speed 10Gbps Server
            </div>
            <div className="text-[10px] text-gray-400 truncate">
              Clean Popup streaming sponsor
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href="https://www.google.com/search?q=fastest+dns+streaming+servers"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-[11px] font-black transition flex items-center gap-1 shadow"
          >
            <span>Open</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
};
