import React, { useState } from 'react';
import { ExternalLink, Sparkles, Volume2, X, Play, Download, Bell, Flame } from 'lucide-react';

interface TopNotificationTickerProps {
  onOpenGuide?: () => void;
}

export const TopNotificationTicker: React.FC<TopNotificationTickerProps> = ({
  onOpenGuide,
}) => {
  // Always running at the top of the website
  const [isMinimized, setIsMinimized] = useState(false);

  if (isMinimized) {
    return (
      <div className="bg-[#1e0709] border-b border-red-500/50 py-1 px-3 flex items-center justify-between z-50 text-[11px] shadow-lg">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="text-amber-300 font-bold">
            Movies Play & Download Info (Clean Window)
          </span>
        </div>
        <button
          onClick={() => setIsMinimized(false)}
          className="text-xs bg-red-600/80 hover:bg-red-500 text-white font-bold px-2 py-0.5 rounded cursor-pointer transition"
        >
          Expand Notice ▲
        </button>
      </div>
    );
  }

  // Marquee item block repeated twice for infinite continuous smooth scrolling
  const marqueeContent = (
    <div className="flex items-center gap-8 shrink-0 py-0.5">
      {/* Segment 1: Simple Hindi & Hinglish */}
      <div className="flex items-center gap-2">
        <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-[0_2px_0_#7f1d1d]">
          📢 HINDI
        </span>
        <span className="text-white font-extrabold tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          Movies play or download ke liye{' '}
          <span className="animate-neon-blink font-black px-1.5 py-0.5 rounded bg-black/40 border border-amber-400/40">
            "Clean Window"
          </span>{' '}
          wale button per click karein!
        </span>
        <span className="text-amber-300 font-bold text-xs">
          (बिना रुकावट और Smooth High-Speed Stream)
        </span>
      </div>

      <span className="text-red-400 font-black text-sm">•</span>

      {/* Segment 2: Simple English */}
      <div className="flex items-center gap-2">
        <span className="bg-amber-500 text-black text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-[0_2px_0_#92400e]">
          🎬 ENGLISH
        </span>
        <span className="text-white font-extrabold tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          To play or download movies, click on the{' '}
          <span className="animate-neon-blink font-black px-1.5 py-0.5 rounded bg-black/40 border border-amber-400/40">
            "Clean Window"
          </span>{' '}
          button for direct smooth playback!
        </span>
      </div>

      <span className="text-red-400 font-black text-sm">•</span>

      {/* Segment 3: Simple Hindi in Devanagari */}
      <div className="flex items-center gap-2">
        <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-[0_2px_0_#064e3b]">
          ⚡ NOTICE
        </span>
        <span className="text-yellow-300 font-black drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          ★ किसी भी Movie / Web Series को Play या Download करने के लिए "Clean Window" वाले बटन पर क्लिक करें!
        </span>
      </div>

      <span className="text-red-400 font-black text-sm">•</span>

      {/* Segment 4: 20 Servers & 4K Quality Notice */}
      <div className="flex items-center gap-2">
        <span className="text-emerald-400 font-bold">
          ⚡ 20 Zero-Sandbox Ultra Fast Servers Active • Hindi Dubbed Dual Audio • 1080p 4K HDR Zero Buffering
        </span>
      </div>

      <span className="text-red-400 font-black text-sm">•</span>
    </div>
  );

  return (
    <div
      className="relative ticker-3d-bar text-white text-[12px] sm:text-[13px] py-1.5 px-3 overflow-hidden shadow-2xl z-50 select-none border-b-2 border-red-600/80"
      style={{
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.25), inset 0 -2px 5px rgba(0,0,0,0.9)',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* 3D Blinking Badge with Flashing Beacon */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="animate-blink-badge flex items-center gap-1.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-black text-[10px] sm:text-[11px] uppercase px-2.5 py-1 rounded-lg border border-red-300/40 shadow-[0_3px_0_#7f1d1d,0_5px_10px_rgba(239,68,68,0.5)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-90"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
            </span>
            <span className="tracking-wider">ALERT</span>
            <span className="hidden sm:inline text-yellow-200">/ जरूरी सूचना</span>
          </div>
        </div>

        {/* 3D Continuous Running Marquee (Always Runs) */}
        <div className="flex-1 overflow-hidden whitespace-nowrap relative mask-marquee">
          <div className="animate-marquee hover:[animation-play-state:paused]">
            {marqueeContent}
            {marqueeContent}
          </div>
        </div>

        {/* 3D Interactive Clean Window Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="btn-3d-clean text-[11px] sm:text-xs text-black font-black px-2.5 sm:px-3 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer uppercase tracking-wide border border-amber-300/50"
              title="Click for Clean Window Guide"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Clean Window</span>
            </button>
          )}

          {/* Minimize toggle */}
          <button
            onClick={() => setIsMinimized(true)}
            className="text-gray-400 hover:text-white p-1 rounded transition-colors cursor-pointer shrink-0"
            title="Minimize notification"
            aria-label="Minimize notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
