import React, { useEffect, useRef } from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';
import { getAdsterraUrlByIndex, triggerAdsterraSmartAd } from '../services/adsterra';

interface AdsterraContainerAdProps {
  className?: string;
  badgeText?: string;
  showFallbackOnBlock?: boolean;
}

/**
 * Adsterra Container Banner component
 * Integrates Adsterra script container:
 * <script async="async" data-cfasync="false" src="https://pl31776069.profitableratecpmnetwork.com/2cae9f806cb49199a9c86feb440549aa/invoke.js"></script>
 * <div id="container-2cae9f806cb49199a9c86feb440549aa"></div>
 *
 * Designed with a stylish, non-intrusive 3D frame that blends perfectly with GOO TV's dark cinema theme.
 */
export const AdsterraContainerAd: React.FC<AdsterraContainerAdProps> = ({
  className = '',
  badgeText = 'SPONSORED CINEMA AD',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptInjectedRef = useRef<boolean>(false);

  useEffect(() => {
    // Only inject once per mount to avoid duplicate invoke requests
    if (scriptInjectedRef.current) return;

    try {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl31776069.profitableratecpmnetwork.com/2cae9f806cb49199a9c86feb440549aa/invoke.js';
      
      // Append to the container element
      if (containerRef.current) {
        containerRef.current.appendChild(script);
        scriptInjectedRef.current = true;
      }
    } catch (e) {
      console.warn('Adsterra invoke banner failed to initialize:', e);
    }
  }, []);

  const fallbackUrl = getAdsterraUrlByIndex(0);

  return (
    <div className={`w-full my-6 flex flex-col items-center justify-center px-3 sm:px-4 ${className}`}>
      {/* Label and Badge */}
      <div className="flex items-center gap-2 mb-1.5 text-[10px] uppercase font-mono tracking-wider text-gray-400">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>{badgeText}</span>
        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded text-[9px] font-bold">
          4K CLOUD
        </span>
      </div>

      {/* Modern High-End Ad Card Frame */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[728px] min-h-[90px] rounded-2xl bg-gradient-to-r from-[#141724] via-[#0f111a] to-[#141724] border border-amber-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center p-2 sm:p-3 overflow-hidden text-center transition-all hover:border-amber-400/60"
      >
        {/* The Exact Adsterra Target Container Required by the Ad Provider */}
        <div
          id="container-2cae9f806cb49199a9c86feb440549aa"
          className="w-full flex items-center justify-center min-h-[60px]"
        />

        {/* Ambient Glow Corner */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Discreet Direct Sponsor link for high CTR & earnings without disrupting UI */}
        <div className="w-full pt-1.5 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400 px-2 mt-1">
          <span className="truncate text-gray-400 text-[10px]">
            ⚡ High-Speed Direct Cloud Streaming Partner
          </span>
          <a
            href={fallbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerAdsterraSmartAd(fallbackUrl)}
            className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold transition text-[10px] shrink-0"
          >
            <span>Explore</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
