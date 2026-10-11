import React, { useState, useEffect, useRef } from 'react';
import { CategoryId, MovieOrShow } from '../types';
import { LANGUAGES_50 } from '../services/i18n';
import { SERVERS_20 } from '../services/playerServers';
import { searchContent, getPosterUrl, getDefaultSearchRecommendations } from '../services/tmdb';
import { TopNotificationTicker } from './TopNotificationTicker';
import {
  Tv,
  Search,
  Bookmark,
  Globe,
  Moon,
  Sun,
  X,
  Menu,
  Star,
  Play,
  Film,
  Sparkles,
  Server,
  Zap,
  Flame,
  Maximize2,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onSelectCategory: (id: CategoryId) => void;
  currentServerIndex: number;
  onOpenServersModal: () => void;
  watchlistCount: number;
  onOpenWatchlist: () => void;
  currentLang: string;
  onOpenLangModal: () => void;
  onPlayMovie: (item: MovieOrShow) => void;
  onOpenCleanGuide?: () => void;
  onOpenShare?: () => void;
  onOpenDetails?: (item: MovieOrShow) => void;
  onOpenSearchModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onSelectCategory,
  currentServerIndex,
  onOpenServersModal,
  watchlistCount,
  onOpenWatchlist,
  currentLang,
  onOpenLangModal,
  onPlayMovie,
  onOpenCleanGuide,
  onOpenShare,
  onOpenDetails,
  onOpenSearchModal,
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [searchResults, setSearchResults] = useState<MovieOrShow[]>(() => getDefaultSearchRecommendations().slice(0, 8));
  const [isSearching, setIsSearching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkOled, setIsDarkOled] = useState(true);

  const searchBoxRef = useRef<HTMLDivElement>(null);
  const currentLangObj = LANGUAGES_50.find((l) => l.code === currentLang) || LANGUAGES_50[0];
  const activeServer = SERVERS_20[currentServerIndex] || SERVERS_20[0];

  // Debounced live auto-search
  useEffect(() => {
    if (!searchVal.trim()) {
      setSearchResults(getDefaultSearchRecommendations().slice(0, 8));
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchContent(searchVal);
        setSearchResults(res.items.slice(0, 8));
      } catch (err) {
        console.warn('Live search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [searchVal]);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setIsDarkOled(!isDarkOled);
    document.documentElement.classList.toggle('dark');
  };

  const navTabs = [
    { id: 'home', label: 'Home' },
    { id: 'top_100', label: '🏆 Top 100' },
    { id: 'categories', label: 'Categories' },
    { id: 'movies', label: 'Movies' },
    { id: 'tv', label: 'TV Series' },
    { id: 'bollywood', label: 'Bollywood' },
    { id: 'anime', label: 'Anime & Asian' },
    { id: 'top_rated', label: 'Top Rated' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#080910]/95 backdrop-blur-md border-b border-white/5 shadow-xl">
      <TopNotificationTicker onOpenGuide={onOpenCleanGuide} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo matching standalone.html */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-500 p-0.5 shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform shrink-0">
            <div className="w-full h-full bg-[#0d0e15] rounded-[10px] flex items-center justify-center">
              <Tv className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-2xl tracking-tight text-white group-hover:text-red-400 transition-colors">
                GOO <span className="text-red-600">TV</span>
              </span>
              <span className="bg-gradient-to-r from-amber-500 to-red-500 text-[10px] font-black text-black px-1.5 py-0.5 rounded shadow">
                VIP
              </span>
            </div>
            <p className="text-[10px] font-medium text-gray-400 -mt-1 hidden sm:block">
              20 Zero-Sandbox Servers • 4K HDR
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTab(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'text-white bg-white/10 shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Search & Utility Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Search Input with Advanced Dropdown */}
          <div ref={searchBoxRef} className="relative w-40 sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search 10,000+ movies..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onFocus={() => setDropdownOpen(true)}
              className="w-full bg-white/10 border border-white/15 rounded-xl pl-9 pr-14 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-black/90 transition-all"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-400">
              {searchVal ? (
                <button
                  onClick={() => setSearchVal('')}
                  className="hover:text-white cursor-pointer p-0.5"
                  title="Clear"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : null}
              {onOpenSearchModal && (
                <button
                  onClick={onOpenSearchModal}
                  className="hover:text-red-400 cursor-pointer p-0.5"
                  title="Open Fullscreen Search"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Advanced Dropdown Results */}
            {dropdownOpen && (
              <div className="absolute top-full mt-2 left-0 right-0 sm:right-auto sm:w-96 bg-[#10121d] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[32rem] flex flex-col">
                {/* Header & Quick Keyword Pills */}
                <div className="p-3 bg-white/[0.03] border-b border-white/10 shrink-0 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-black">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      {searchVal ? <Search className="w-3.5 h-3.5 text-red-500" /> : <Flame className="w-3.5 h-3.5 fill-amber-400" />}
                      <span>{searchVal ? `Live Results for "${searchVal}"` : 'Default Trending & Popular (डिफ़ॉल्ट फिल्में)'}</span>
                    </span>
                    <span className="text-[10px] text-gray-400">{searchResults.length} Titles</span>
                  </div>

                  {/* Quick keyword pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {['Stree 2', 'Pushpa 2', 'Squid Game', 'Kalki', 'Animal', 'Deadpool'].map((chip) => (
                      <button
                        key={chip}
                        onClick={() => {
                          setSearchVal(chip);
                        }}
                        className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-red-600 text-[10px] font-bold text-gray-200 hover:text-white transition cursor-pointer shrink-0"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Results List */}
                <div className="p-2 space-y-1 overflow-y-auto flex-1">
                  {isSearching ? (
                    <div className="p-6 text-center text-xs text-gray-400 animate-pulse">
                      ⚡ Searching verified stream...
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-6 text-center text-xs text-gray-400">
                      No titles found. Try "Stree 2", "Pushpa", or "Squid Game".
                    </div>
                  ) : (
                    searchResults.map((item) => {
                      const isTv = item.media_type === 'tv' || (!item.title && !!item.name);
                      return (
                        <div
                          key={`nav-search-${item.id}`}
                          onClick={() => {
                            setDropdownOpen(false);
                            if (onOpenDetails) {
                              onOpenDetails(item);
                            } else {
                              onPlayMovie(item);
                            }
                          }}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 cursor-pointer transition group border border-transparent hover:border-white/10"
                        >
                          <img
                            src={getPosterUrl(item.poster_path, 'w342')}
                            alt={item.title}
                            className="w-10 h-14 object-cover rounded-lg bg-black shrink-0 border border-white/10"
                          />
                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs font-black text-white truncate group-hover:text-red-400">
                              {item.title || item.name}
                            </h5>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                              <span className="text-amber-400 font-bold flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-amber-400" />
                                {item.vote_average ? item.vote_average.toFixed(1) : '7.5'}
                              </span>
                              <span>•</span>
                              <span>{(item.release_date || item.first_air_date || '').slice(0, 4)}</span>
                              <span>•</span>
                              <span className="text-[9px] uppercase px-1 rounded bg-white/10 text-gray-300 font-bold">
                                {isTv ? 'Series' : 'Movie'}
                              </span>
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-red-600/20 group-hover:bg-red-600 text-red-400 group-hover:text-white flex items-center justify-center shrink-0 transition">
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer Fullscreen Action */}
                {onOpenSearchModal && (
                  <div className="p-2 border-t border-white/10 bg-white/[0.02] shrink-0">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenSearchModal();
                      }}
                      className="w-full py-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Open Fullscreen Advanced Search (बड़ी विंडो)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Watchlist Trigger matching standalone.html */}
          <button
            onClick={onOpenWatchlist}
            className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
            title="Watchlist"
          >
            <Bookmark className="w-4 h-4" />
            {watchlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Clean Window Action Pill */}
          {onOpenCleanGuide && (
            <button
              onClick={onOpenCleanGuide}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-300 font-extrabold text-xs transition-all cursor-pointer shadow-sm"
              title="Clean Popup Window Guide"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Clean Window</span>
            </button>
          )}

          {/* 20 Active Servers Status Trigger matching standalone.html */}
          <button
            onClick={onOpenServersModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs transition-all cursor-pointer"
            title="Switch from 20 Zero-Sandbox Streaming Servers"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate max-w-[120px]">{activeServer.name.split(' ')[0]} 4K</span>
          </button>

          {/* 50 Languages trigger */}
          <button
            onClick={onOpenLangModal}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer flex items-center gap-1"
            title="Choose Language (50 Languages)"
          >
            <Globe className="w-4 h-4 text-red-500" />
            <span className="hidden xl:inline text-xs font-semibold">{currentLangObj.nativeName}</span>
          </button>

          {/* Theme Toggle matching standalone.html */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
            title="Toggle Cinema OLED theme"
          >
            {isDarkOled ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden p-4 bg-[#0d0f17] border-b border-white/10 space-y-2 animate-in fade-in duration-200">
          <div className="grid grid-cols-3 gap-2">
            {navTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  onSelectTab(t.id);
                  setMobileMenuOpen(false);
                }}
                className={`p-2 rounded-xl text-xs font-bold text-center border ${
                  activeTab === t.id
                    ? 'bg-red-600 text-white border-red-500'
                    : 'bg-white/5 text-gray-300 border-white/5'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenServersModal();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-emerald-400 flex items-center gap-1 font-bold"
            >
              <Server className="w-3.5 h-3.5" />
              <span>20 Zero-Sandbox Servers</span>
            </button>
            <button
              onClick={() => {
                onOpenLangModal();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-gray-300 flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5 text-red-500" />
              <span>{currentLangObj.name} (50 Langs)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
