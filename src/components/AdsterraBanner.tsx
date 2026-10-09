import React from 'react';
import { Sparkles, ExternalLink, X } from 'lucide-react';
import { getAdsterraUrlByIndex, triggerAdsterraSmartAd } from '../services/adsterra';

interface AdsterraBannerProps {
  type: 'leaderboard' | 'rectangle' | 'sticky-bottom';
  adsEnabled: boolean;
  onCloseSticky?: () => void;
}

export const AdsterraBanner: React.FC<AdsterraBannerProps> = ({
  type,
  adsEnabled,
  onCloseSticky,
}) => {
  if (!adsEnabled) return null;

  const ad1 = getAdsterraUrlByIndex(0);
  const ad2 = getAdsterraUrlByIndex(1);
  const ad3 = getAdsterraUrlByIndex(2);

  if (type === 'leaderboard') {
    return (
      <div className="w-full my-6 flex flex-col items-center justify-center px-4">
        <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1 flex items-center gap-1 font-mono">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Sponsored Adsterra Network • 728x90 Leaderboard</span>
        </div>
        <div className="w-full max-w-[728px] h-[90px] bg-gradient-to-r from-gray-900 via-[#181a24] to-gray-900 border border-amber-500/30 rounded-xl flex items-center justify-between px-6 shadow-lg shadow-black/40 overflow-hidden relative group">
          <div className="flex items-center gap-3 z-10">
            <div className="w-10 h-10 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 font-bold text-lg font-cinematic tracking-wider">
              GOO
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                Ultra High-Speed Cinema Streaming
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">AD</span>
              </div>
              <p className="text-xs text-gray-400">Stream in 4K HDR without buffering • Adsterra Verified Partner</p>
            </div>
          </div>
          <a
            href={ad1}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerAdsterraSmartAd(ad1)}
            className="z-10 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-red-900/40 transition shrink-0"
          >
            <span>Explore Offers</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-amber-500/5 to-transparent pointer-events-none" />
        </div>
      </div>
    );
  }

  if (type === 'rectangle') {
    return (
      <div className="w-full flex flex-col items-center justify-center my-4">
        <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1 font-mono">
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
            className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-red-950/40"
          >
            <span>Activate Sponsor Offer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // Sticky bottom mobile banner
  return (
    <div className="fixed bottom-14 md:bottom-2 left-2 right-2 md:left-auto md:right-4 md:w-96 z-40 bg-[#141620] border border-amber-500/40 rounded-xl p-2.5 shadow-2xl shadow-black/80 flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono px-1.5 py-0.5 rounded shrink-0">
          AD
        </span>
        <div className="truncate">
          <div className="text-xs font-semibold text-white truncate">Adsterra High-Speed Server 10Gbps</div>
          <div className="text-[10px] text-gray-400 truncate">Adsterra active monetized slot</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <a
          href={ad2}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => triggerAdsterraSmartAd(ad2)}
          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-bold transition flex items-center gap-1"
        >
          <span>Open</span>
          <ExternalLink className="w-3 h-3" />
        </a>
        {onCloseSticky && (
          <button
            onClick={onCloseSticky}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
