import React, { useState, useEffect } from 'react';
import { MovieOrShow } from '../types';
import { fetchCategoryContent } from '../services/tmdb';
import { MovieCard } from './MovieCard';
import {
  Trophy,
  Star,
  Film,
  Sparkles,
  Loader2,
  Tv,
  Globe,
  SlidersHorizontal,
  Flame,
  Monitor,
  Smartphone,
  Tablet,
} from 'lucide-react';

interface Top100HubProps {
  onPlay: (item: MovieOrShow) => void;
  onOpenDetails: (item: MovieOrShow) => void;
  onOpenPopup: (item: MovieOrShow) => void;
  isInWatchlist: (id: number) => boolean;
  onToggleWatchlist: (item: MovieOrShow) => void;
}

export const Top100Hub: React.FC<Top100HubProps> = ({
  onPlay,
  onOpenDetails,
  onOpenPopup,
  isInWatchlist,
  onToggleWatchlist,
}) => {
  const [items, setItems] = useState<MovieOrShow[]>([]);
  const [filter, setFilter] = useState<'global' | 'bollywood' | 'hollywood' | 'south' | 'kdrama'>('global');
  const [sortBy, setSortBy] = useState<'rating' | 'year' | 'votes'>('rating');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deviceType, setDeviceType] = useState<string>('desktop');

  // Detect device watching source
  useEffect(() => {
    const ua = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(ua) || (window.innerWidth >= 768 && window.innerWidth <= 1024)) {
      setDeviceType('tablet');
    } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua) || window.innerWidth < 768) {
      setDeviceType('mobile');
    } else {
      setDeviceType('desktop');
    }
  }, []);

  useEffect(() => {
    async function loadTop100() {
      setIsLoading(true);
      try {
        let catId: any = 'top-100';
        let subcat: any = 'all';

        if (filter === 'bollywood') catId = 'hindi-movies';
        else if (filter === 'hollywood') catId = 'english-movies';
        else if (filter === 'south') { catId = 'south-movies'; subcat = 'all'; }
        else if (filter === 'kdrama') catId = 'k-drama';

        // Fetch pages 1 to 3 to get up to 60-100 titles
        const [p1, p2, p3] = await Promise.all([
          fetchCategoryContent(catId, subcat, 1),
          fetchCategoryContent(catId, subcat, 2),
          fetchCategoryContent(catId, subcat, 3),
        ]);

        const merged = [...p1.items, ...p2.items, ...p3.items];
        
        // Sort and assign ranks 1 to 100
        const sorted = merged.sort((a, b) => {
          if (sortBy === 'rating') return (b.vote_average || 0) - (a.vote_average || 0);
          if (sortBy === 'year') {
            const yA = (a.release_date || a.first_air_date || '').slice(0, 4);
            const yB = (b.release_date || b.first_air_date || '').slice(0, 4);
            return Number(yB) - Number(yA);
          }
          return (b.vote_count || 0) - (a.vote_count || 0);
        });

        const withRanks = sorted.slice(0, 100).map((it, idx) => ({
          ...it,
          rank: idx + 1,
        }));

        setItems(withRanks);
      } catch (err) {
        console.warn('Failed to load Top 100:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadTop100();
  }, [filter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Top Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950/60 via-[#131522] to-red-950/60 border border-amber-500/30 p-6 sm:p-8 shadow-2xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-black">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>OFFICIAL GOO TV HALL OF FAME</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none font-cinematic">
              TOP 100 ALL-TIME GLOBAL BLOCKBUSTERS
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Verified highest-rated cinema from Hollywood, Bollywood, South India, and Asian cinema. Ranked #1 to #100 with zero buffering and clean popup playback.
            </p>
          </div>

          {/* Device Source Watching Badge */}
          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md flex items-center gap-3 shrink-0">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {deviceType === 'mobile' ? (
                <Smartphone className="w-5 h-5" />
              ) : deviceType === 'tablet' ? (
                <Tablet className="w-5 h-5" />
              ) : (
                <Monitor className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="text-xs font-black text-white flex items-center gap-1.5">
                <span>Watching Source:</span>
                <span className="uppercase text-amber-400 font-mono text-[10px]">
                  {deviceType} Device
                </span>
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">
                {deviceType === 'mobile'
                  ? '⚡ Touch Optimized • Ultra Lightweight'
                  : deviceType === 'tablet'
                  ? '🖥️ Responsive Tablet Canvas • 1080p FHD'
                  : '🎬 4K HDR Theater Mode • Clean Popup Ready'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Sorting Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-6">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <button
            onClick={() => setFilter('global')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              filter === 'global'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-black shadow-md'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            🌟 Global Top 100
          </button>
          <button
            onClick={() => setFilter('bollywood')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              filter === 'bollywood'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            🇮🇳 Bollywood Top 100
          </button>
          <button
            onClick={() => setFilter('hollywood')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              filter === 'hollywood'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            🇺🇸 Hollywood Top 100
          </button>
          <button
            onClick={() => setFilter('south')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              filter === 'south'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            🌴 South Indian Top 100
          </button>
          <button
            onClick={() => setFilter('kdrama')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              filter === 'kdrama'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            🇰🇷 K-Drama Top 100
          </button>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <span className="text-gray-400 flex items-center gap-1 font-semibold">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Sort:</span>
          </span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-[#141624] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none cursor-pointer"
          >
            <option value="rating">★ Highest Rating First</option>
            <option value="votes">🔥 Most Popular Global Votes</option>
            <option value="year">📅 Release Year (Newest)</option>
          </select>
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="py-28 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-9 h-9 text-amber-500 animate-spin" />
          <span className="text-xs text-gray-400 font-semibold">
            Loading Top 100 Hall of Fame titles...
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {items.map((item) => (
            <MovieCard
              key={`top100-${item.id}`}
              item={item}
              onPlay={onPlay}
              onOpenDetails={onOpenDetails}
              onOpenPopup={onOpenPopup}
              isInWatchlist={isInWatchlist(item.id)}
              onToggleWatchlist={onToggleWatchlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};
