import React, { useState } from 'react';
import { MovieOrShow, WatchlistItem } from '../types';
import { getPosterUrl } from '../services/tmdb';
import { X, Play, Trash2, Bookmark, History } from 'lucide-react';

interface HistoryItem {
  id: number;
  title: string;
  poster_path: string | null;
  media_type: 'movie' | 'tv';
  timestamp: number;
}

interface DrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'watchlist' | 'history';
  watchlist: WatchlistItem[];
  historyList: HistoryItem[];
  onPlay: (item: MovieOrShow) => void;
  onRemoveWatchlist: (id: number) => void;
  onClearWatchlist: () => void;
  onClearHistory: () => void;
}

export const DrawerModal: React.FC<DrawerModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'watchlist',
  watchlist,
  historyList,
  onPlay,
  onRemoveWatchlist,
  onClearWatchlist,
  onClearHistory,
}) => {
  const [tab, setTab] = useState<'watchlist' | 'history'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#10121d] h-full shadow-2xl border-l border-white/10 p-5 flex flex-col justify-between animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTab('watchlist')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  tab === 'watchlist'
                    ? 'bg-red-600 text-white shadow'
                    : 'text-gray-400 bg-white/5 hover:text-white'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Watchlist ({watchlist.length})</span>
              </button>

              <button
                onClick={() => setTab('history')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  tab === 'history'
                    ? 'bg-red-600 text-white shadow'
                    : 'text-gray-400 bg-white/5 hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>History ({historyList.length})</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Content */}
          <div className="mt-4 space-y-2 overflow-y-auto max-h-[75vh] pr-1">
            {tab === 'watchlist' ? (
              watchlist.length === 0 ? (
                <div className="text-center py-24 text-gray-400 text-xs space-y-2">
                  <Bookmark className="w-8 h-8 mx-auto text-gray-600" />
                  <p>Your watchlist is empty.</p>
                  <p className="text-[11px] text-gray-500">Click "+" on any movie card to save it here.</p>
                </div>
              ) : (
                watchlist.map(({ item }) => {
                  const poster = getPosterUrl(item.poster_path, 'w342');
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition group"
                    >
                      <img
                        src={poster}
                        alt={item.title}
                        className="w-10 h-14 object-cover rounded bg-black shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-bold text-white truncate group-hover:text-red-400">
                          {item.title || item.name}
                        </h5>
                        <span className="text-[10px] text-gray-400 uppercase font-mono">
                          {item.original_language} • {item.media_type}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            onClose();
                            onPlay(item);
                          }}
                          className="p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs cursor-pointer"
                          title="Play"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                        </button>
                        <button
                          onClick={() => onRemoveWatchlist(item.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition cursor-pointer"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )
            ) : historyList.length === 0 ? (
              <div className="text-center py-24 text-gray-400 text-xs space-y-2">
                <History className="w-8 h-8 mx-auto text-gray-600" />
                <p>No watch history yet.</p>
              </div>
            ) : (
              historyList.map((h) => {
                const poster = getPosterUrl(h.poster_path, 'w342');
                return (
                  <div
                    key={h.id}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition group"
                  >
                    <img
                      src={poster}
                      alt={h.title}
                      className="w-10 h-14 object-cover rounded bg-black shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold text-white truncate group-hover:text-red-400">
                        {h.title}
                      </h5>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        Streamed recently
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onPlay({
                          id: h.id,
                          title: h.title,
                          overview: '',
                          poster_path: h.poster_path,
                          backdrop_path: null,
                          media_type: h.media_type,
                          vote_average: 8.0,
                          original_language: 'en',
                        });
                      }}
                      className="p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs cursor-pointer shrink-0"
                      title="Play"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
          <span>Saved locally on device</span>
          {tab === 'watchlist' && watchlist.length > 0 ? (
            <button
              onClick={onClearWatchlist}
              className="text-red-400 hover:underline cursor-pointer"
            >
              Clear Watchlist
            </button>
          ) : tab === 'history' && historyList.length > 0 ? (
            <button
              onClick={onClearHistory}
              className="text-red-400 hover:underline cursor-pointer"
            >
              Clear History
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
