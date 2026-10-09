import React, { useState, useEffect, useRef } from 'react';
import { CategoryId, MovieOrShow } from '../types';
import { LANGUAGES_50 } from '../services/i18n';
import { SERVERS_20 } from '../services/playerServers';
import { searchContent, getPosterUrl } from '../services/tmdb';
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
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [searchResults, setSearchResults] = useState<MovieOrShow[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkOled, setIsDarkOled] = useState(true);

  const searchBoxRef = useRef<HTMLDivElement>(null);
  const currentLangObj = LANGUAGES_50.find((l) => l.code === currentLang) || LANGUAGES_50[0];
  const activeServer = SERVERS_20[currentServerIndex] || SERVERS_20[0];

  // Debounced search
  useEffect(() => {
    if (!searchVal.trim()) {
      setSearchResults([]);
      setDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await searchContent(searchVal);
        setSearchResults(res.items.slice(0, 8));
        setDropdownOpen(true);
      } catch (err) {
        console.warn('Live search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

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
          {/* Live Search Input with Dropdown matching standalone.html */}
          <div ref={searchBoxRef} className="relative w-36 sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search 10,000+ movies..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onFocus={() => searchResults.length > 0 && setDropdownOpen(true)}
              className="w-full bg-white/10 border border-white/15 rounded-xl pl-9 pr-7 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-black/90 transition-all"
            />
            {searchVal && (
              <button
                onClick={() => setSearchVal('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Dropdown Results */}
            {dropdownOpen && (
              <div className="absolute top-full mt-2 left-0 right-0 sm:right-auto sm:w-80 bg-[#12141f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
                <div className="p-2 space-y-1">
                  {isSearching ? (
                    <div className="p-4 text-center text-xs text-gray-400">Searching TMDB...</div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-gray-400">No results found.</div>
                  ) : (
                    searchResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setDropdownOpen(false);
                          setSearchVal('');
                          onPlayMovie(item);
                        }}
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 cursor-pointer transition group"
                      >
                        <img
                          src={getPosterUrl(item.poster_path, 'w342')}
                          alt={item.title}
                          className="w-9 h-12 object-cover rounded bg-black shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h5 className="text-xs font-bold text-white truncate group-hover:text-red-400">
                            {item.title || item.name}
                          </h5>
                          <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                            <span className="text-amber-400 font-bold flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-amber-400" />
                              {item.vote_average}
                            </span>
                            <span>•</span>
                            <span>{(item.release_date || item.first_air_date || '').slice(0, 4)}</span>
                          </div>
                        </div>
                        <Play className="w-3.5 h-3.5 text-red-500 shrink-0 opacity-0 group-hover:opacity-100 transition" />
                      </div>
                    ))
                  )}
                </div>
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
