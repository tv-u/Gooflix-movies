import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Zap,
  Maximize2,
  Volume2,
  Sun,
  RotateCcw,
  RotateCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Play,
  Film,
  Flame,
} from 'lucide-react';

interface EntryPopupNotificationProps {
  onClose: () => void;
  onOpenCleanWindowGuide?: () => void;
}

export const EntryPopupNotification: React.FC<EntryPopupNotificationProps> = ({
  onClose,
  onOpenCleanWindowGuide,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(5);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  // Auto-close after 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleDismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const progressPercentage = ((5 - secondsLeft) / 5) * 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl transition-all duration-300 ${
        isClosing ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.25)_0%,transparent_70%)] pointer-events-none" />

      {/* Main 3D Modal Box */}
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#181a26] via-[#12141f] to-[#0a0b12] border-2 border-red-500/70 rounded-3xl shadow-[0_20px_60px_rgba(220,38,38,0.35),0_0_40px_rgba(234,179,8,0.2)] overflow-hidden text-white flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Top 5-second Countdown Progress Bar */}
        <div className="w-full bg-white/10 h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-red-500 to-rose-600 transition-all duration-1000 ease-linear"
            style={{ width: `${Math.min(100, Math.max(0, 100 - progressPercentage))}%` }}
          />
        </div>

        {/* Header Bar */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-[#161825]/90">
          <div className="flex items-center gap-2.5">
            {/* 3D Blinking Alert Badge */}
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs uppercase px-3 py-1 rounded-xl shadow-[0_3px_0_#7f1d1d,0_0_15px_rgba(239,68,68,0.6)] animate-pulse border border-red-400/40">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-90"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400"></span>
              </span>
              <span>⚡ 3D ALERT</span>
              <span className="text-yellow-300 font-extrabold hidden sm:inline">/ जरूरी सूचना</span>
            </div>

            <span className="text-xs text-gray-300 font-medium">
              Closing in <strong className="text-amber-400 font-black text-sm">{secondsLeft}s</strong>
            </span>
          </div>

          {/* Quick × Close Button (Requested by user) */}
          <button
            onClick={handleDismiss}
            aria-label="Close notification"
            className="p-2 rounded-2xl bg-white/10 hover:bg-red-600 text-gray-300 hover:text-white transition-all cursor-pointer shadow-lg hover:rotate-90 duration-200 border border-white/10"
            title="Close Notice (×)"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Main Hindi Notice Banner (3D Style) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/80 via-black/80 to-amber-950/80 border-2 border-amber-500/50 shadow-[0_8px_25px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)]">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-400 text-black font-black shrink-0 mt-0.5 shadow-lg shadow-amber-500/30">
                <Sparkles className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-black tracking-wider uppercase text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                  📢 HINDI / हिन्दी
                </span>
                <p className="mt-1.5 text-base sm:text-lg font-black text-white leading-snug">
                  Movies play or download ke liye{' '}
                  <span className="text-amber-300 underline decoration-amber-400 underline-offset-4 decoration-2">
                    "Clean Window"
                  </span>{' '}
                  wale button per click karein!
                </p>
                <p className="text-xs text-gray-300 mt-1 font-medium">
                  ★ Clean Window पर 100% बिना रुकावट, डायरेक्ट फुल-स्पीड 4K प्लेबैक और नो-ऐड्स मिलता है।
                </p>
              </div>
            </div>
          </div>

          {/* English Notice Banner */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-red-600 text-white font-black shrink-0 mt-0.5 shadow-lg">
                <Play className="w-5 h-5 fill-white" />
              </div>
              <div>
                <span className="text-[10px] font-black tracking-wider uppercase text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/40">
                  🎬 ENGLISH NOTICE
                </span>
                <p className="mt-1.5 text-sm sm:text-base font-bold text-gray-100 leading-snug">
                  To play or download movies smoothly, click the{' '}
                  <span className="text-yellow-400 font-extrabold">"Clean Window"</span> button!
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Enjoy zero ads, instant high-speed bufferless streaming, and multi-track audio.
                </p>
              </div>
            </div>
          </div>

          {/* 4 Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                <RotateCw className="w-4 h-4" />
              </div>
              <div>
                <div className="font-extrabold text-white text-[11px] sm:text-xs">10s Skip & Back</div>
                <div className="text-[10px] text-gray-400">±10 Second Fast Seek</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 shrink-0">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <div className="font-extrabold text-white text-[11px] sm:text-xs">Bilibili Brightness</div>
                <div className="text-[10px] text-gray-400">Left Screen Swipe Gestures</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-extrabold text-white text-[11px] sm:text-xs">MX Player Volume</div>
                <div className="text-[10px] text-gray-400">Right Screen Swipe & Boost</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="font-extrabold text-white text-[11px] sm:text-xs">Real Dual Audio</div>
                <div className="text-[10px] text-gray-400">Hindi + English + 4K</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#141624] flex items-center justify-between gap-3">
          <button
            onClick={handleDismiss}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white font-bold text-xs sm:text-sm cursor-pointer transition flex items-center gap-1.5"
          >
            <X className="w-4 h-4" />
            <span>Samajh Gaya / Close</span>
          </button>

          <button
            onClick={() => {
              handleDismiss();
              if (onOpenCleanWindowGuide) onOpenCleanWindowGuide();
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-red-600 hover:from-amber-300 hover:to-red-500 text-black font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 cursor-pointer transition flex items-center gap-2 border border-amber-300/60"
          >
            <ExternalLink className="w-4 h-4 stroke-[2.5]" />
            <span>⚡ Clean Window Info</span>
          </button>
        </div>
      </div>
    </div>
  );
};
