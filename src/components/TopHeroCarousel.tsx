import React, { useState, useEffect } from 'react';
import { MovieOrShow } from '../types';
import { getBackdropUrl, getPosterUrl } from '../services/tmdb';
import {
  Play,
  Info,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Mic,
  Star,
  Sparkles,
} from 'lucide-react';

interface TopHeroCarouselProps {
  items: MovieOrShow[];
  onPlay: (item: MovieOrShow) => void;
  onOpenDetails: (item: MovieOrShow) => void;
  onOpenPopup: (item: MovieOrShow) => void;
}

export const TopHeroCarousel: React.FC<TopHeroCarouselProps> = ({
  items,
  onPlay,
  onOpenDetails,
  onOpenPopup,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Take top 8 HD titles for the carousel
  const spotlightItems = items.slice(0, 8);

  // Auto-advance every 4.5 seconds
  useEffect(() => {
    if (spotlightItems.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % spotlightItems.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [spotlightItems.length, isPaused]);

  if (spotlightItems.length === 0) return null;

  const current = spotlightItems[currentIndex];
  const backdrop = getBackdropUrl(current.backdrop_path, 'original');
  const poster = getPosterUrl(current.poster_path, 'w500');
  const year = (current.release_date || current.first_air_date || '').slice(0, 4);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] overflow-hidden bg-black select-none border-b border-white/10"
    >
      {/* Background HD Image with Transition */}
      <div className="absolute inset-0">
        <img
          key={current.id}
          src={backdrop}
          alt={current.title || current.name}
          className="w-full h-full object-cover object-top opacity-55 scale-105 animate-in fade-in zoom-in-95 duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/70 to-transparent" />
      </div>

      {/* Main Content Area */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8 sm:pb-12 z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            {/* Top Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-red-600 text-white font-black text-[10px] sm:text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-md shadow-red-900/60">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>TOP SPOTLIGHT #{currentIndex + 1}</span>
              </span>

              <span className="px-2 py-0.5 rounded bg-amber-500 text-black font-black text-[10px]">
                4K ULTRA HD
              </span>

              {current.isDubbedHindi && (
                <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded bg-amber-400 text-black shadow">
                  <Mic className="w-3 h-3 stroke-[3]" />
                  <span>HINDI DUBBED</span>
                </span>
              )}

              <span className="flex items-center gap-1 text-amber-400 font-bold text-xs bg-black/60 px-2 py-0.5 rounded border border-amber-500/30">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{(current.vote_average || 8.0).toFixed(1)}</span>
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none drop-shadow-md">
              {current.title || current.name}
            </h2>

            {/* Synopsis */}
            <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 max-w-xl leading-relaxed drop-shadow">
              {current.overview}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 pt-1 flex-wrap">
              <button
                onClick={() => onPlay(current)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs flex items-center gap-1.5 shadow-xl shadow-red-600/40 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Watch Movie Now</span>
              </button>

              <button
                onClick={() => onOpenPopup(current)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
                title="Play in distraction-free clean popup window"
              >
                <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Clean Popup Window</span>
              </button>

              <button
                onClick={() => onOpenDetails(current)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Details</span>
              </button>
            </div>
          </div>

          {/* Right mini-poster preview */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="w-24 aspect-[2/3] rounded-xl overflow-hidden border border-white/20 shadow-2xl shrink-0 bg-black">
              <img src={poster} alt={current.title} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Prev / Next Carousel Controls */}
      <button
        onClick={() =>
          setCurrentIndex((prev) => (prev - 1 + spotlightItems.length) % spotlightItems.length)
        }
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-red-600 text-white border border-white/20 flex items-center justify-center transition cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % spotlightItems.length)}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-red-600 text-white border border-white/20 flex items-center justify-center transition cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Indicators Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {spotlightItems.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              currentIndex === idx ? 'w-6 bg-red-600 shadow' : 'w-1.5 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
