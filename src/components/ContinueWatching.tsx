import React from 'react';
import { MovieOrShow } from '../types';
import { getPosterUrl } from '../services/tmdb';
import { History, Play, Trash2 } from 'lucide-react';

interface HistoryItem {
  id: number;
  title: string;
  poster_path: string | null;
  media_type: 'movie' | 'tv';
  timestamp: number;
}

interface ContinueWatchingProps {
  historyList: HistoryItem[];
  onPlay: (item: MovieOrShow) => void;
  onViewAllHistory: () => void;
  onClearHistory?: () => void;
}

export const ContinueWatching: React.FC<ContinueWatchingProps> = ({
  historyList,
  onPlay,
  onViewAllHistory,
}) => {
  if (historyList.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <History className="w-4 h-4" />
          </span>
          <h2 className="text-lg font-black text-white">Continue Watching</h2>
        </div>
        <button
          onClick={onViewAllHistory}
          className="text-xs font-bold text-gray-400 hover:text-white transition cursor-pointer"
        >
          View All History →
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-none">
        {historyList.slice(0, 10).map((h) => {
          const poster = getPosterUrl(h.poster_path, 'w342');
          return (
            <div
              key={h.id}
              onClick={() =>
                onPlay({
                  id: h.id,
                  title: h.title,
                  overview: '',
                  poster_path: h.poster_path,
                  backdrop_path: null,
                  media_type: h.media_type,
                  vote_average: 8.0,
                  original_language: 'en',
                })
              }
              className="group shrink-0 w-48 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-red-500 p-2 flex gap-2.5 items-center cursor-pointer transition-all"
            >
              <img
                src={poster}
                alt={h.title}
                className="w-12 h-16 object-cover rounded-lg shrink-0 bg-black"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-white truncate group-hover:text-red-400">
                  {h.title}
                </h4>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-red-600 text-white mt-1 inline-flex items-center gap-1 shadow">
                  <Play className="w-2.5 h-2.5 fill-white" />
                  <span>RESUME</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
