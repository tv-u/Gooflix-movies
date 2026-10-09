import React from 'react';
import { MovieOrShow } from '../types';
import { getPosterUrl } from '../services/tmdb';
import { Play, Plus, Check, Mic, Trophy } from 'lucide-react';

interface MovieCardProps {
  item: MovieOrShow;
  onPlay: (item: MovieOrShow) => void;
  onOpenDetails: (item: MovieOrShow) => void;
  onOpenPopup?: (item: MovieOrShow) => void;
  isInWatchlist: boolean;
  onToggleWatchlist: (item: MovieOrShow) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  item,
  onPlay,
  onOpenDetails,
  onOpenPopup,
  isInWatchlist,
  onToggleWatchlist,
}) => {
  const poster = getPosterUrl(item.poster_path, 'w500');
  const title = item.title || item.name || 'Untitled';
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : '7.5';
  const isTv = item.media_type === 'tv' || (!item.title && !!item.name);

  // Top 100 Rank styling
  const rank = item.rank;
  const isTop3 = rank && rank <= 3;

  return (
    <div className="group relative select-none flex flex-col justify-between w-full">
      {/* Poster with Play Overlay */}
      <div
        onClick={() => onPlay(item)}
        className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#181a24] border border-white/5 group-hover:border-red-500/60 shadow-lg group-hover:shadow-2xl group-hover:shadow-red-950/40 transition-all duration-300 cursor-pointer"
      >
        <img
          src={poster}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

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
      <div className="mt-2.5 px-0.5">
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
                className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 transition-colors cursor-pointer"
                title="Open clean popup player"
              >
                POPUP
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
