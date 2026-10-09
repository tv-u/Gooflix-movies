import React, { useState, useEffect, useRef } from 'react';
import { MovieOrShow } from '../types';
import { getBackdropUrl, getPosterUrl } from '../services/tmdb';
import { openCleanPlayWindow, openCleanDownloadWindow } from '../services/cleanWindow';
import { getAdsterraUrlByIndex, triggerAdsterraSmartAd } from '../services/adsterra';
import {
  Play,
  Info,
  Star,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Download,
  Flame,
  Tv,
  Film,
  Zap
} from 'lucide-react';

interface HeroBannerProps {
  featuredItems: MovieOrShow[];
  activeMedia?: MovieOrShow | null;
  onPlay: (item: MovieOrShow) => void;
  onOpenDetails: (item: MovieOrShow) => void;
  onToast?: (msg: string) => void;
}

// Fallback blockbuster titles so the top is NEVER blank even before first fetch returns
const FALLBACK_HERO_ITEMS: MovieOrShow[] = [
  {
    id: 1022789,
    title: 'Kalki 2898 AD',
    name: 'Kalki 2898 AD',
    overview:
      'A modern avatar of the Hindu god Vishnu, believed to have descended to the earth in the Kali Yuga to protect the world from evil forces in a futuristic cyberpunk world.',
    backdrop_path: '/stKGOm8dHxt890qSfgm9dknFvWJ.jpg',
    poster_path: '/9Kk3zKqNqP9y10l2L3J2gJ4k5Lm.jpg',
    media_type: 'movie',
    vote_average: 8.4,
    release_date: '2024-06-27',
    original_language: 'te',
    quality: '4K',
    isDubbedHindi: true,
  },
  {
    id: 872585,
    title: 'Oppenheimer',
    name: 'Oppenheimer',
    overview:
      'The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II, exploring moral dilemmas and scientific triumph.',
    backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    media_type: 'movie',
    vote_average: 8.9,
    release_date: '2023-07-21',
    original_language: 'en',
    quality: '4K',
    isDubbedHindi: true,
  },
  {
    id: 93405,
    title: 'Squid Game (Season 2)',
    name: 'Squid Game (Season 2)',
    overview:
      'Hundreds of cash-strapped players accept a strange invitation to compete in children’s games. Inside awaits a tempting prize with deadly high stakes.',
    backdrop_path: '/oaGvjB0DvdurWhfPtAhA6QgRw9.jpg',
    poster_path: '/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg',
    media_type: 'tv',
    vote_average: 8.5,
    first_air_date: '2021-09-17',
    original_language: 'ko',
    quality: '4K',
    isDubbedHindi: true,
  },
  {
    id: 866398,
    title: 'Animal (Uncut)',
    name: 'Animal (Uncut)',
    overview:
      'A son’s love for his father blossoms into a brutal transformation as he steps into a dark criminal underworld to protect family honor.',
    backdrop_path: '/tl7z62kL1f6Jb85uU55M7jJ4o4x.jpg',
    poster_path: '/hrGIg2Z2lW067r3o2a02qg5b6C.jpg',
    media_type: 'movie',
    vote_average: 7.8,
    release_date: '2023-12-01',
    original_language: 'hi',
    quality: '4K',
    isDubbedHindi: true,
  },
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredItems,
  activeMedia,
  onPlay,
  onOpenDetails,
  onToast,
}) => {
  const items = featuredItems.length > 0 ? featuredItems.slice(0, 8) : FALLBACK_HERO_ITEMS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync if activeMedia passed
  useEffect(() => {
    if (activeMedia) {
      const idx = items.findIndex((i) => i.id === activeMedia.id);
      if (idx !== -1) setCurrentIndex(idx);
    }
  }, [activeMedia, items]);

  // Auto-rotate poster showcase every 5.5 seconds smoothly
  useEffect(() => {
    if (isHovered || items.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, items.length]);

  const currentItem = items[currentIndex] || items[0] || FALLBACK_HERO_ITEMS[0];
  const backdrop = getBackdropUrl(currentItem.backdrop_path || currentItem.poster_path, 'original');
  const rating = (currentItem.vote_average || 8.4).toFixed(1);
  const isTv = currentItem.media_type === 'tv' || (!currentItem.title && !!currentItem.name);

  const handleCleanPopupPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    openCleanPlayWindow(currentItem, 1, 1, currentItem.isDubbedHindi ? 'hi' : undefined);
    if (onToast) {
      onToast('⚡ Clean Popup Window opened for direct high-speed playback!');
    }
  };

  const handleCleanPopupDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    openCleanDownloadWindow(currentItem, '4k', 1, 1);
    if (onToast) {
      onToast('⚡ Clean Download Window opened for 4K / 1080p direct stream!');
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* HERO BILLBOARD CONTAINER - 100% Zero Blank Space */}
      <section className="relative w-full min-h-[580px] sm:min-h-[660px] md:min-h-[720px] flex items-end pb-12 sm:pb-16 bg-[#07080c]">
        {/* Dynamic Backdrop with crossfade transition */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            key={currentItem.id}
            src={backdrop}
            alt={currentItem.title || currentItem.name}
            className="w-full h-full object-cover object-center sm:object-top transform scale-100 animate-fadeIn duration-700 opacity-65"
          />
          {/* Multi-layered Cinema Gradients for supreme legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/70 to-transparent max-w-4xl" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/80" />
        </div>

        {/* Content Overlay */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pt-28 sm:pt-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            {/* Left Column: Title, Metadata & Action Buttons */}
            <div className="lg:col-span-8 space-y-4">
              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-md shadow-red-600/30">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  <span>TRENDING SPOTLIGHT #{currentIndex + 1}</span>
                </span>

                <span className="px-2 py-0.5 rounded-md bg-amber-400 text-black font-black text-[11px] shadow">
                  4K ULTRA HD
                </span>

                <span className="flex items-center gap-1 text-amber-300 font-black text-xs bg-black/75 px-2 py-0.5 rounded-md border border-amber-400/30">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{rating}</span>
                </span>

                {currentItem.isDubbedHindi && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 text-white font-bold text-[10px] tracking-wide flex items-center gap-1 border border-emerald-400/30">
                    <span>🇮🇳 Hindi Dubbed</span>
                  </span>
                )}

                <span className="text-[11px] font-semibold text-gray-300 px-2 py-0.5 rounded bg-white/10 backdrop-blur-sm">
                  {isTv ? '📺 Web Series' : '🎬 Feature Film'}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.05] drop-shadow-2xl">
                {currentItem.title || currentItem.name}
              </h1>

              {/* Overview Synopsis */}
              <p className="text-xs sm:text-sm text-gray-200/90 max-w-2xl line-clamp-3 leading-relaxed drop-shadow font-normal">
                {currentItem.overview}
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 pt-2">
                {/* 1. Main Watch Button */}
                <button
                  onClick={() => onPlay(currentItem)}
                  className="px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-red-600/40 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Watch Movie Now</span>
                </button>

                {/* 2. Primary Feature: Clean Popup Window Button */}
                <button
                  onClick={handleCleanPopupPlay}
                  className="px-4 sm:px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-xl shadow-amber-500/30 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Open clean popup window for distraction-free movie play"
                >
                  <Zap className="w-4 h-4 fill-black stroke-black" />
                  <span>Clean Popup Window</span>
                </button>

                {/* 3. Details Button */}
                <button
                  onClick={() => onOpenDetails(currentItem)}
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer"
                >
                  <Info className="w-4 h-4" />
                  <span>Details</span>
                </button>

                {/* 4. Direct 4K Download */}
                <button
                  onClick={handleCleanPopupDownload}
                  className="px-3.5 py-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Download in 4K or 1080p via Clean Window"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            </div>

            {/* Right Column: Live HD Poster Carousel Thumbnails (No Blank Space) */}
            <div className="lg:col-span-4 hidden md:flex flex-col items-end gap-3">
              <div className="flex items-center justify-between w-full max-w-sm mb-1">
                <span className="text-[11px] font-black uppercase text-gray-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Live HD Posters Updating</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrev}
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    aria-label="Previous poster"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    aria-label="Next poster"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Thumbnails Filmstrip */}
              <div className="flex gap-2 max-w-sm overflow-x-auto pb-1 scrollbar-none">
                {items.map((item, idx) => {
                  const posterUrl = getPosterUrl(item.poster_path, 'w342');
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`relative flex-shrink-0 w-16 sm:w-20 aspect-[2/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        isActive
                          ? 'border-red-500 scale-105 shadow-lg shadow-red-500/40 ring-2 ring-red-400/50'
                          : 'border-white/10 opacity-60 hover:opacity-100 hover:scale-100'
                      }`}
                    >
                      <img
                        src={posterUrl}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-1 inset-x-1 text-[8px] font-bold text-white truncate text-center">
                        {item.title || item.name}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Carousel Indicators */}
              <div className="flex items-center gap-1.5 mt-1">
                {items.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex ? 'w-6 bg-red-600' : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ADSTERRA SPONSORED VIP BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4">
        <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-[#181a27] to-red-950/40 p-3 sm:p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-xs sm:text-sm">
                  ⚡ High-Speed Cloud VIP Streaming & Direct Downloads
                </span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-400 text-black shadow">
                  SPONSORED
                </span>
              </div>
              <p className="text-[11px] text-gray-300 mt-0.5">
                Clean Popup Window mode active: Zero buffering, 20 high-speed verified CDN engines, and Hindi audio tracks.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCleanPopupPlay}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/30 transition-all shrink-0 cursor-pointer"
            >
              <span>Launch Clean Window Player</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <a
              href={getAdsterraUrlByIndex(1)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerAdsterraSmartAd(getAdsterraUrlByIndex(1))}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer border border-white/10"
              title="Adsterra 10Gbps Dedicated Cloud CDN"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Adsterra VIP 10Gbps</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
