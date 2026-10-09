import React from 'react';
import { WatchlistItem, MovieOrShow } from '../types';
import { getPosterUrl } from '../services/tmdb';
import { X, Play, Trash2, Bookmark, Film, Tv, Star } from 'lucide-react';

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: WatchlistItem[];
  onPlay: (item: MovieOrShow) => void;
  onRemove: (id: number) => void;
  onClearAll: () => void;
}

export const WatchlistModal: React.FC<WatchlistModalProps> = ({
  isOpen,
  onClose,
  watchlist,
  onPlay,
  onRemove,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#12141d] border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl shadow-red-950/30 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-[#161824]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                My Watchlist
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-900/40 text-amber-300 border border-amber-700/50">
                  {watchlist.length} {watchlist.length === 1 ? 'Item' : 'Items'}
                </span>
              </h2>
              <p className="text-xs text-gray-400">Saved titles ready to stream across all 8 servers</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {watchlist.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-gray-400 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-950/30 transition cursor-pointer"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[65vh] scrollbar-thin scrollbar-thumb-gray-800">
          {watchlist.length === 0 ? (
            <div className="py-16 text-center text-gray-400 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#181a26] border border-gray-800 mx-auto flex items-center justify-center text-gray-500">
                <Bookmark className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-gray-200">Your Watchlist is Empty</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Explore Hindi movies, South blockbusters, K-Dramas, or English hits and click the '+' button to save them here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {watchlist.map(({ item }) => {
                const poster = getPosterUrl(item.poster_path, 'w342');
                const year = (item.release_date || item.first_air_date || '').slice(0, 4);

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-[#161824] border border-gray-800 hover:border-gray-700 transition group"
                  >
                    <div className="w-16 aspect-[2/3] rounded-lg overflow-hidden bg-black shrink-0">
                      <img src={poster} alt={item.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-red-400">
                        {item.title || item.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                        <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{item.vote_average}</span>
                        </span>
                        {year && <span>• {year}</span>}
                        <span className="uppercase text-[10px] font-mono px-1 rounded bg-gray-800">
                          {item.original_language}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => {
                            onClose();
                            onPlay(item);
                          }}
                          className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>Play</span>
                        </button>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition cursor-pointer"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
