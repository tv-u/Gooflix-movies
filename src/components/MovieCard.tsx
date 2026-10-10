import React, { useState } from 'react';
import { MovieOrShow } from '../types';
import { getPosterUrl } from '../services/tmdb';
import { Play, Plus, Check, Mic, Trophy, Sparkles } from 'lucide-react';

interface MovieCardProps {
  item: MovieOrShow;
  onPlay: (item: MovieOrShow) => void;
  onOpenDetails: (item: MovieOrShow) => void;
  onOpenPopup?: (item: MovieOrShow) => void;
  isInWatchlist: boolean;
  onToggleWatchlist: (item: MovieOrShow) => void;
}

// In-memory cache for loaded image URLs to guarantee 0-ms re-renders
const loadedImagesCache = new Set<string>();

export const MovieCard: React.FC<MovieCardProps> = ({
  item,
  onPlay,
  onOpenDetails,
  onOpenPopup,
  isInWatchlist,
  onToggleWatchlist,
}) => {
  // Ultra-fast w342 image for high-speed CDN loading
  const poster = getPosterUrl(item.poster_path, 'w342');
  const title = item.title || item.name || 'Untitled';
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : '7.5';
  const isTv = item.media_type === 'tv' || (!item.title && !!item.name);

  // Fast image load state
  const isAlreadyLoaded = loadedImagesCache.has(poster);
  const [imageLoaded, setImageLoaded] = useState<boolean>(isAlreadyLoaded);
  const [imageError, setImageError] = useState<boolean>(false);

  // Top 100 Rank styling
  const rank = item.rank;
  const isTop3 = rank && rank <= 3;

  const handleImageLoad = () => {
    loadedImagesCache.add(poster);
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="group relative select-none flex flex-col justify-between w-full">
      {/* Poster with Play Overlay & Fast Shimmer Skeleton - Click opens Movie Details & Download Window */}
      <div
        onClick={() => onOpenDetails(item)}
        className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#151722] border border-white/5 group-hover:border-red-500/60 shadow-lg group-hover:shadow-2xl group-hover:shadow-red-950/40 transition-all duration-300 cursor-pointer"
      >
        {/* Instant Shimmer Placeholder while loading */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-tr from-[#12141f] via-[#1a1c2a] to-[#12141f] animate-pulse flex items-center justify-center">
            <span className="text-[10px] font-black text-gray-500 tracking-wider">GOO TV</span>
          </div>
        )}

        {/* High-speed decoded original studio poster */}
        {poster && !imageError ? (
          <img
            src={poster}
            alt={title}
            loading="lazy"
            decoding="async"
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          /* Authentic Movie-Branded Card for this exact movie - Never an unrelated photo */
          <div className="w-full h-full flex flex-col justify-between p-3.5 bg-gradient-to-b from-[#181a29] via-[#10121d] to-[#0a0b12] text-white select-none border border-white/10">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-black text-red-500 tracking-wider">GOO TV</span>
              <span className="text-amber-400 font-bold">★ {rating}</span>
            </div>
            <div className="text-center py-4 my-auto">
              <h4 className="text-sm sm:text-base font-black text-white line-clamp-3 leading-snug drop-shadow-md">
                {title}
              </h4>
              <p className="text-[11px] font-bold text-gray-400 mt-1.5">{year || '2025'} • {isTv ? 'Series' : 'Movie'}</p>
            </div>
            <div className="flex items-center justify-between text-[9px] text-gray-400 pt-2 border-t border-white/10">
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold uppercase">Original</span>
              <span className="text-emerald-400 font-black">4K UHD</span>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2 inset-x-2 flex items-center justify-between pointer-events-none text-[9px] font-black z-10 gap-1">
          {/* Top 100 Rank Badge if present */}
          {rank ? (
            <span
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg font-black shadow-lg ${
                rank === 1
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-amber-500/40'
                  : rank === 2
                  ? 'bg-gradient-to-r from-gray-200 to-slate-400 text-black shadow-white/30'
                  : rank === 3
                  ? 'bg-gradient-to-r from-amber-700 to-yellow-800 text-white shadow-amber-800/40'
                  : 'bg-black/80 text-white border border-white/20'
              }`}
            >
              {isTop3 && <Trophy className="w-2.5 h-2.5" />}
              <span>#{rank}</span>
            </span>
          ) : (
            <span className="bg-black/70 backdrop-blur-md text-amber-400 px-1.5 py-0.5 rounded-md border border-amber-400/30">
              ★ {rating}
            </span>
          )}

          <div className="flex items-center gap-1">
            {rank && (
              <span className="bg-black/70 backdrop-blur-md text-amber-400 px-1.5 py-0.5 rounded-md border border-amber-400/30">
                ★ {rating}
              </span>
            )}
            <span className="bg-red-600 text-white px-1.5 py-0.5 rounded-md shadow">4K</span>
          </div>
        </div>

        {/* Hindi Dubbed Tag if present */}
        {item.isDubbedHindi && (
          <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
            <span className="flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500 text-black shadow">
              <Mic className="w-2.5 h-2.5 stroke-[3]" />
              <span>HINDI</span>
            </span>
          </div>
        )}

        {/* Center Hover Play Icon Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl shadow-red-600/80 transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Watchlist toggle in top right corner on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist(item);
          }}
          className={`absolute top-2 right-2 z-20 p-1.5 rounded-xl border transition cursor-pointer opacity-0 group-hover:opacity-100 ${
            isInWatchlist
              ? 'bg-red-600 text-white border-red-500 opacity-100 shadow-md'
              : 'bg-black/80 text-gray-200 border-white/20 hover:bg-black'
          }`}
          title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          {isInWatchlist ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Info & Bottom Quick Action Buttons */}
      <div className="mt-2 px-0.5">
        <h4
          onClick={() => onOpenDetails(item)}
          className="text-xs sm:text-sm font-extrabold text-white group-hover:text-red-400 truncate cursor-pointer transition"
          title={title}
        >
          {title}
        </h4>

        <div className="flex items-center justify-between mt-1 text-[11px] text-gray-400">
          <span className="truncate mr-1 text-[10px] sm:text-[11px]">
            {year} • {isTv ? 'TV' : 'Movie'}
          </span>

          <div className="flex items-center gap-1 shrink-0">
            {onOpenPopup && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPopup(item);
                }}
                className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-400/30 transition-colors cursor-pointer flex items-center gap-0.5"
                title="Clean Window: Fast Play & Download"
              >
                <Sparkles className="w-2.5 h-2.5" />
                <span>CLEAN</span>
              </button>
            )}

            <button
              onClick={() => onPlay(item)}
              className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white transition-colors cursor-pointer"
            >
              WATCH
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
