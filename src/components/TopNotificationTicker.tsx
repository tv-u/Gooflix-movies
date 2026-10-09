import React, { useState } from 'react';
import { ExternalLink, Sparkles, Volume2, X } from 'lucide-react';

interface TopNotificationTickerProps {
  onOpenGuide?: () => void;
}

export const TopNotificationTicker: React.FC<TopNotificationTickerProps> = ({
  onOpenGuide,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-red-950 via-rose-900 to-amber-950 border-b border-red-500/30 text-white text-[12px] sm:text-[13px] py-1.5 px-3 overflow-hidden shadow-md z-50 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left Badge */}
        <div className="flex items-center gap-1.5 shrink-0 bg-red-600/90 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded shadow">
          <span className="animate-pulse">🔔</span>
          <span>NOTICE</span>
        </div>

        {/* Marquee Ticker */}
        <div className="flex-1 overflow-hidden whitespace-nowrap relative">
          <div className="inline-block animate-marquee hover:[animation-play-state:paused] font-semibold tracking-wide text-gray-100">
            <span className="text-amber-300 font-bold">
              ★ किसी भी Movie या Show को Play या Download करने के लिए "Clean Popup Window" वाले बटन पर क्लिक करें और Free में बिना Ads व रुकावट के सभी Movies देखें!
            </span>
            <span className="mx-4 text-red-400 font-extrabold">•</span>
            <span className="text-white">
              ★ To Play or Download any movie/web series, click the "Clean Popup Window" button to watch smoothly in 100% Free 4K HD!
            </span>
            <span className="mx-4 text-red-400 font-extrabold">•</span>
            <span className="text-emerald-300 font-bold">
              ⚡ 20 High-Speed Servers Active • Hindi Dubbed Dual Audio • Multi-Language Subtitles • Zero Buffering
            </span>
          </div>
        </div>

        {/* Quick Clean Action pill */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <span className="text-[11px] bg-amber-400 text-black font-extrabold px-2 py-0.5 rounded flex items-center gap-1 shadow">
            <Sparkles className="w-3 h-3 text-black" />
            <span>Clean Window Active</span>
          </span>
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="text-[11px] text-gray-300 hover:text-white underline cursor-pointer"
            >
              How to watch?
            </button>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-300 hover:text-white p-0.5 rounded transition-colors cursor-pointer shrink-0"
          title="Dismiss notice"
          aria-label="Dismiss notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
