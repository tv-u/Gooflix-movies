import React from 'react';
import { Sparkles, ExternalLink, X, Zap } from 'lucide-react';
import { getAdsterraUrlByIndex, triggerAdsterraSmartAd } from '../services/adsterra';

interface SmartAdsterraProps {
  placement: 'leaderboard-728' | 'sidebar-300' | 'sticky-bottom' | 'in-feed';
  onClose?: () => void;
}

export const SmartAdsterra: React.FC<SmartAdsterraProps> = ({ placement, onClose }) => {
  // Use 1st direct link for Leaderboard, 2nd for Sticky, 3rd for Sidebar/In-feed
  const ad1 = getAdsterraUrlByIndex(0);
  const ad2 = getAdsterraUrlByIndex(1);
  const ad3 = getAdsterraUrlByIndex(2);

  if (placement === 'leaderboard-728') {
    return (
      <div className="w-full my-5 flex flex-col items-center justify-center px-4">
        <div className="text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-1 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Sponsored Adsterra Smart Network • 728x90 Ultra High Speed Node</span>
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
                Zero ISP throttling, 4K HDR master feeds, and instant clean popup streaming.
              </p>
            </div>
          </div>

          <a
            href={ad1}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerAdsterraSmartAd(ad1)}
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
              Clean Popup streaming sponsor • Active
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={ad2}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerAdsterraSmartAd(ad2)}
            className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-[11px] font-black transition flex items-center gap-1 shadow"
          >
            <span>Open</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-white transition cursor-pointer"
              aria-label="Close Ad"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (placement === 'sidebar-300' || placement === 'in-feed') {
    return (
      <div className="w-full flex flex-col items-center justify-center my-4">
        <div className="text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-1">
          Adsterra 300x250 Medium Rectangle
        </div>
        <div className="w-[300px] h-[250px] bg-[#12141c] border border-amber-500/30 rounded-2xl flex flex-col items-center justify-center p-5 text-center relative overflow-hidden shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-[10px] bg-amber-500/20 text-amber-400 font-mono px-2 py-0.5 rounded-full mb-2">
            Adsterra Direct Sponsor
          </span>
          <h4 className="text-sm font-bold text-white mb-1">High Speed Cloud Streaming</h4>
          <p className="text-xs text-gray-400 mb-4">Unlimited 4K HDR Bandwidth with Zero-Lag Nodes.</p>
          <a
            href={ad3}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerAdsterraSmartAd(ad3)}
            className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-amber-950/40"
          >
            <span>Activate Sponsor Offer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  return null;
};
