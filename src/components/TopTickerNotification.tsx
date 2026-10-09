import React from 'react';
import { Sparkles, ExternalLink, Zap } from 'lucide-react';

interface TopTickerNotificationProps {
  onOpenQuickPopup?: () => void;
}

export const TopTickerNotification: React.FC<TopTickerNotificationProps> = () => {
  return (
    <aside aria-label="Announcement" className="w-full bg-gradient-to-r from-red-950 via-[#180a0e] to-amber-950 border-b border-amber-500/30 text-xs py-2 px-3 overflow-hidden relative shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left Badge */}
        <div className="flex items-center gap-1.5 shrink-0 bg-red-600 text-white font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow-md shadow-red-900/40">
          <Zap className="w-3 h-3 fill-white animate-pulse" />
          <span>HELP TIP</span>
        </div>

        {/* Scrolling Ticker Text in Hindi & English */}
        <div className="flex-1 overflow-hidden relative whitespace-nowrap">
          <div className="inline-block animate-marquee whitespace-nowrap text-white font-medium text-[11px] sm:text-xs">
            <span className="text-amber-300 font-extrabold mr-2">📢 सूचना:</span>
            <span>किसी भी मूवी या वेब सीरीज़ को बिना रुकावट देखने और हाई-स्पीड 4K डाउनलोड करने के लिए </span>
            <strong className="text-amber-400 bg-black/50 px-2 py-0.5 rounded mx-1 font-black border border-amber-500/40">
              'POPUP / Clean Window'
            </strong>
            <span> वाले बटन पर क्लिक करें और बिल्कुल फ्री में सब मूवीज देखें!</span>
            <span className="mx-4 text-gray-500">•</span>
            <span className="text-emerald-400 font-bold mr-1">⚡ NOTICE:</span>
            <span>For 100% ad-free, bufferless streaming and direct 4K downloads, click the </span>
            <strong className="text-emerald-300 bg-black/50 px-2 py-0.5 rounded mx-1 font-black border border-emerald-500/40">
              'POPUP / Clean Window'
            </strong>
            <span> button to enjoy all movies completely free!</span>
          </div>
        </div>

        {/* Right Highlight pill */}
        <div className="hidden sm:flex items-center gap-1 shrink-0 text-[10px] font-black text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-lg">
          <Sparkles className="w-3 h-3" />
          <span>100% FREE • POPUP MODE</span>
        </div>
      </div>
    </aside>
  );
};
