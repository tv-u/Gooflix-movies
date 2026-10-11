import React, { useState, useEffect, useRef } from 'react';
import { MovieOrShow } from '../types';
import { searchContent, getDefaultSearchRecommendations, getPosterUrl } from '../services/tmdb';
import { Search, X, Star, Play, Sparkles, Film, Tv, Download, ArrowRight, Flame } from 'lucide-react';

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayMovie: (item: MovieOrShow) => void;
  onOpenDetails: (item: MovieOrShow) => void;
}

const POPULAR_KEYWORDS = [
  'Stree 2',
  'Pushpa 2',
  'Squid Game',
  'Kalki 2898 AD',
  'Animal',
  'Carry On Jatta 3',
  'Deadpool',
  'Dune 2',
  'Hindi Dubbed',
  'K-Drama',
  'South Movies',
  'Marvel 4K',
];

export const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({
  isOpen,
  onClose,
  onPlayMovie,
  onOpenDetails,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MovieOrShow[]>(() => getDefaultSearchRecommendations());
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'movie' | 'tv'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on open & body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const t = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => {
        clearTimeout(t);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Instant Live Auto-Search as user types ("keyword jese dale to automatic movies data show krne lage")
  useEffect(() => {
    if (!isOpen) return;

    if (!query.trim()) {
      setResults(getDefaultSearchRecommendations());
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchContent(query.trim());
        setResults(res.items);
      } catch (err) {
        console.warn('Advanced live search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  // Keyboard shortcut listener (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter results by media type if selected
  const filteredResults = results.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'movie') return item.media_type === 'movie' || (!item.media_type && !item.name);
    if (activeFilter === 'tv') return item.media_type === 'tv' || (!item.title && !!item.name);
    return true;
  });

  const isDefaultView = !query.trim();

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-start p-3 sm:p-6 md:p-8 overflow-y-auto animate-in fade-in duration-200">
      <div className="max-w-6xl w-full mx-auto my-auto flex flex-col min-h-full">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center font-black text-white text-base shadow-lg shadow-red-600/40">
              G
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>GOO TV Advanced Search</span>
                <span className="text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded-full uppercase">
                  Live Instant Engine
                </span>
              </h2>
              <p className="text-[11px] text-gray-400">
                Type any movie name, web series, or keyword to auto-discover titles in real-time
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 hover:bg-red-600 text-gray-300 hover:text-white transition cursor-pointer"
            title="Close Search (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Search Input Box */}
        <div className="relative mt-5">
          <div className="relative flex items-center">
            <Search className="w-6 h-6 text-red-500 absolute left-4 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, K-Dramas, Bollywood, Hollywood, anime... (उदा: Stree 2, Pushpa, Squid Game)"
              className="w-full bg-[#12141f] border-2 border-white/15 focus:border-red-500 rounded-2xl pl-13 pr-12 py-4 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none shadow-2xl transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Popular Keyword Chips (कीवर्ड्स) */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[11px] font-bold text-amber-400 shrink-0 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>Trending:</span>
          </span>
          {POPULAR_KEYWORDS.map((kw) => (
            <button
              key={kw}
              onClick={() => setQuery(kw)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                query === kw
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/40'
                  : 'bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white border border-white/10'
              }`}
            >
              {kw}
            </button>
          ))}
        </div>

        {/* Filter Badges & Status Header */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              {isDefaultView ? (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 font-extrabold">
                    🔥 Default Trending & Popular Cinema (डिफ़ॉल्ट फिल्में)
                  </span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-red-500" />
                  <span className="text-white font-extrabold">
                    Instant Results for "{query}" ({filteredResults.length} Found)
                  </span>
                </>
              )}
            </span>
            {isSearching && (
              <span className="text-[11px] text-red-400 animate-pulse font-bold">
                ⚡ Searching verified stream...
              </span>
            )}
          </div>

          {/* Type Filters */}
          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                activeFilter === 'all' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              All ({results.length})
            </button>
            <button
              onClick={() => setActiveFilter('movie')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                activeFilter === 'movie' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => setActiveFilter('tv')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                activeFilter === 'tv' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Series & K-Drama
            </button>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="mt-6 flex-1">
          {filteredResults.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <Film className="w-12 h-12 text-gray-600 mx-auto" />
              <h3 className="text-base font-bold text-gray-300">No movies found for "{query}"</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try searching with popular keywords like "Stree 2", "Pushpa", "Animal", or "Squid Game".
              </p>
              <button
                onClick={() => setQuery('')}
                className="mt-3 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
              >
                Reset to Default Movies
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 pb-12">
              {filteredResults.map((item) => {
                const poster = getPosterUrl(item.poster_path, 'w500');
                const title = item.title || item.name || 'Untitled';
                const year = (item.release_date || item.first_air_date || '').slice(0, 4);
                const rating = item.vote_average ? item.vote_average.toFixed(1) : '7.5';
                const isTv = item.media_type === 'tv' || (!item.title && !!item.name);

                return (
                  <div
                    key={`search-${item.id}`}
                    className="group relative select-none flex flex-col justify-between w-full bg-[#12141f] rounded-2xl overflow-hidden border border-white/10 hover:border-red-500/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-red-950/40"
                  >
                    {/* Poster with Click to Open Details */}
                    <div
                      onClick={() => {
                        onClose();
                        onOpenDetails(item);
                      }}
                      className="relative aspect-[2/3] w-full overflow-hidden bg-black cursor-pointer"
                    >
                      {poster ? (
                        <img
                          src={poster}
                          alt={title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col justify-between p-3 bg-gradient-to-b from-[#1c1e2d] to-[#0f111a] text-white">
                          <span className="text-[10px] font-black text-red-500">GOO TV</span>
                          <span className="text-xs font-black line-clamp-3 leading-snug">{title}</span>
                          <span className="text-[9px] text-gray-400">{year} • 4K</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

                      {/* Top Badges */}
                      <div className="absolute top-2 inset-x-2 flex items-center justify-between text-[9px] font-black z-10 pointer-events-none">
                        <span className="bg-black/70 backdrop-blur-md text-amber-400 px-1.5 py-0.5 rounded border border-amber-400/30">
                          ★ {rating}
                        </span>
                        <span className="bg-red-600 text-white px-1.5 py-0.5 rounded shadow">
                          {isTv ? 'SERIES' : '4K'}
                        </span>
                      </div>

                      {/* Hindi Dubbed Tag */}
                      {item.isDubbedHindi && (
                        <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500 text-black shadow">
                            DUAL AUDIO
                          </span>
                        </div>
                      )}

                      {/* Hover Center Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                            onPlayMovie(item);
                          }}
                          className="w-11 h-11 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-600/60 transform scale-90 group-hover:scale-100 transition-transform cursor-pointer hover:bg-red-500"
                          title="Watch Now"
                        >
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Metadata & Quick Action Buttons */}
                    <div className="p-2.5 flex flex-col justify-between flex-1">
                      <div
                        onClick={() => {
                          onClose();
                          onOpenDetails(item);
                        }}
                        className="cursor-pointer"
                      >
                        <h4 className="text-xs font-black text-white line-clamp-1 group-hover:text-red-400 transition-colors">
                          {title}
                        </h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {year || '2024'} • {isTv ? 'Web Series' : 'Movie'}
                        </p>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            onClose();
                            onPlayMovie(item);
                          }}
                          className="flex-1 py-1 px-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] flex items-center justify-center gap-1 transition cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>Play</span>
                        </button>
                        <button
                          onClick={() => {
                            onClose();
                            onOpenDetails(item);
                          }}
                          className="py-1 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                          title="Details & Download"
                        >
                          <Download className="w-3 h-3 text-amber-400" />
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
