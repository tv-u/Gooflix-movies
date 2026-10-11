import React, { useState, useMemo } from 'react';
import { CATEGORIES, CATEGORY_GROUPS } from '../services/categories';
import { CategoryId, CategoryGroup } from '../types';
import { SERVERS_20 } from '../services/playerServers';
import { LANGUAGES_50 } from '../services/i18n';
import {
  X,
  Search,
  Sparkles,
  Flame,
  Film,
  Tv,
  Globe,
  Server,
  Bookmark,
  Zap,
  Dice5,
  SlidersHorizontal,
  ChevronRight,
  Shield,
  Layers,
  Crown,
  Play,
  Grid,
} from 'lucide-react';

interface MegaMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  onSelectTab: (tab: string) => void;
  onOpenServersModal: () => void;
  onOpenLangModal: () => void;
  onOpenWatchlist: () => void;
  onOpenCleanGuide?: () => void;
  currentServerIndex: number;
  currentLang: string;
  watchlistCount: number;
  onRandomPick?: () => void;
}

export const MegaMenuModal: React.FC<MegaMenuModalProps> = ({
  isOpen,
  onClose,
  activeCategory,
  onSelectCategory,
  onSelectTab,
  onOpenServersModal,
  onOpenLangModal,
  onOpenWatchlist,
  onOpenCleanGuide,
  currentServerIndex,
  currentLang,
  watchlistCount,
  onRandomPick,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<CategoryGroup | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'tv'>('all');

  const currentLangObj = LANGUAGES_50.find((l) => l.code === currentLang) || LANGUAGES_50[0];
  const activeServer = SERVERS_20[currentServerIndex] || SERVERS_20[0];

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return CATEGORIES.filter((cat) => {
      // Group filter
      if (selectedGroup !== 'all' && cat.group !== selectedGroup) {
        return false;
      }
      // Media type filter
      if (filterType !== 'all') {
        if (filterType === 'movie' && cat.mediaType === 'tv') return false;
        if (filterType === 'tv' && cat.mediaType === 'movie') return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesLabel = cat.label.toLowerCase().includes(q);
        const matchesBadge = cat.badge.toLowerCase().includes(q);
        const matchesDesc = cat.description.toLowerCase().includes(q);
        const matchesId = cat.id.toLowerCase().includes(q);
        return matchesLabel || matchesBadge || matchesDesc || matchesId;
      }
      return true;
    });
  }, [selectedGroup, filterType, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-start overflow-hidden animate-in fade-in duration-200"
    >
      {/* Top Navbar Inside Mega Menu */}
      <div className="w-full bg-[#0d0f18]/95 border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-amber-500 to-red-600 p-0.5 shadow-lg shadow-red-600/30">
            <div className="w-full h-full bg-[#0c0d14] rounded-[10px] flex items-center justify-center">
              <Tv className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl text-white tracking-tight">
                GOO <span className="text-red-600">TV</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-gradient-to-r from-amber-500 to-red-500 text-black">
                MEGA MENU
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">
              Worldwide Movie & TV Directory • 128 Categories • 20 Streaming Servers
            </p>
          </div>
        </div>

        {/* Live Search inside Menu */}
        <div className="flex-1 max-w-md relative hidden sm:block">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search category, genre, language, country..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-white/10 hover:bg-red-600/20 text-gray-300 hover:text-white hover:border-red-500/50 border border-white/10 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold shrink-0"
        >
          <X className="w-5 h-5" />
          <span className="hidden md:inline">Close / बंद करें</span>
        </button>
      </div>

      {/* Main Content Area: Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Mobile Search Input */}
        <div className="relative sm:hidden">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all 128 categories..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Section 1: Quick Action Hub Tiles */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick Features & Utilities / मुख्य फीचर्स</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {/* 20 Servers Switcher */}
            <button
              onClick={() => {
                onOpenServersModal();
                onClose();
              }}
              className="p-3 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-emerald-900/10 border border-emerald-500/30 hover:border-emerald-400 text-left transition group cursor-pointer hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Server className="w-4 h-4" />
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="font-extrabold text-xs text-white group-hover:text-emerald-300">
                20 Servers
              </div>
              <div className="text-[10px] text-emerald-400 font-medium truncate">
                Active: {activeServer.name.split(' ')[0]}
              </div>
            </button>

            {/* 50 Languages */}
            <button
              onClick={() => {
                onOpenLangModal();
                onClose();
              }}
              className="p-3 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-indigo-900/10 border border-indigo-500/30 hover:border-indigo-400 text-left transition group cursor-pointer hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <Globe className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-indigo-300">50 Lang</span>
              </div>
              <div className="font-extrabold text-xs text-white group-hover:text-indigo-300">
                Languages
              </div>
              <div className="text-[10px] text-gray-400 font-medium truncate">
                {currentLangObj.name} ({currentLangObj.nativeName})
              </div>
            </button>

            {/* Watchlist */}
            <button
              onClick={() => {
                onOpenWatchlist();
                onClose();
              }}
              className="p-3 rounded-2xl bg-gradient-to-br from-red-950/40 to-red-900/10 border border-red-500/30 hover:border-red-400 text-left transition group cursor-pointer hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
                  <Bookmark className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black bg-red-600 text-white px-1.5 py-0.2 rounded-full">
                  {watchlistCount}
                </span>
              </div>
              <div className="font-extrabold text-xs text-white group-hover:text-red-300">
                My Watchlist
              </div>
              <div className="text-[10px] text-gray-400 font-medium">Saved Movies & Shows</div>
            </button>

            {/* Clean Window Mode */}
            {onOpenCleanGuide && (
              <button
                onClick={() => {
                  onOpenCleanGuide();
                  onClose();
                }}
                className="p-3 rounded-2xl bg-gradient-to-br from-amber-950/40 to-amber-900/10 border border-amber-500/30 hover:border-amber-400 text-left transition group cursor-pointer hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-300">Ad-Free</span>
                </div>
                <div className="font-extrabold text-xs text-white group-hover:text-amber-300">
                  Clean Window
                </div>
                <div className="text-[10px] text-gray-400 font-medium">Pop-up Cinema Mode</div>
              </button>
            )}

            {/* Surprise Me / Random Pick */}
            <button
              onClick={() => {
                if (onRandomPick) onRandomPick();
                onClose();
              }}
              className="p-3 rounded-2xl bg-gradient-to-br from-purple-950/40 to-purple-900/10 border border-purple-500/30 hover:border-purple-400 text-left transition group cursor-pointer hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                  <Dice5 className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-purple-300">Instant</span>
              </div>
              <div className="font-extrabold text-xs text-white group-hover:text-purple-300">
                Surprise Me
              </div>
              <div className="text-[10px] text-gray-400 font-medium">Play Random Hit</div>
            </button>

            {/* Top 100 Hub */}
            <button
              onClick={() => {
                onSelectTab('top_100');
                onClose();
              }}
              className="p-3 rounded-2xl bg-gradient-to-br from-yellow-950/40 to-yellow-900/10 border border-yellow-500/30 hover:border-yellow-400 text-left transition group cursor-pointer hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="p-1.5 rounded-lg bg-yellow-500/20 text-yellow-400">
                  <Crown className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-yellow-300">VIP</span>
              </div>
              <div className="font-extrabold text-xs text-white group-hover:text-yellow-300">
                Top 100 Movies
              </div>
              <div className="text-[10px] text-gray-400 font-medium">Ranked #1 to #100</div>
            </button>
          </div>
        </div>

        {/* Section 2: Group Category Filter Chips */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-red-500" />
              <span>Browse Worldwide Categories ({filteredCategories.length} Categories)</span>
            </h3>

            {/* Movie vs TV Filter */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-[11px]">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-0.5 rounded-lg font-bold transition ${
                  filterType === 'all' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('movie')}
                className={`px-2.5 py-0.5 rounded-lg font-bold transition flex items-center gap-1 ${
                  filterType === 'movie' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Film className="w-3 h-3" /> Movies
              </button>
              <button
                onClick={() => setFilterType('tv')}
                className={`px-2.5 py-0.5 rounded-lg font-bold transition flex items-center gap-1 ${
                  filterType === 'tv' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Tv className="w-3 h-3" /> TV Series
              </button>
            </div>
          </div>

          {/* Group Chips Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedGroup('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 border transition cursor-pointer ${
                selectedGroup === 'all'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white border-red-500 shadow-md shadow-red-600/30'
                  : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'
              }`}
            >
              🌟 All Groups (128)
            </button>
            {CATEGORY_GROUPS.map((grp) => {
              const isSelected = selectedGroup === grp.id;
              return (
                <button
                  key={grp.id}
                  onClick={() => setSelectedGroup(grp.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 border transition cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                      : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'
                  }`}
                >
                  <span>{grp.icon}</span>
                  <span>{grp.label.replace(/^[^\s]+\s*/, '')}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: The Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 pb-6">
          {filteredCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onSelectTab('home');
                  onClose();
                }}
                className={`p-3 rounded-2xl text-left border transition group cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isActive
                    ? 'bg-gradient-to-br from-red-950/80 to-[#161825] border-red-500 shadow-lg shadow-red-600/20 ring-1 ring-red-500'
                    : 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl shrink-0">{cat.icon}</span>
                      <span
                        className={`font-black text-xs leading-snug group-hover:text-red-400 transition ${
                          isActive ? 'text-red-400' : 'text-white'
                        }`}
                      >
                        {cat.label}
                      </span>
                    </div>
                    {cat.isPrimary && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0">
                        Top
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-1">{cat.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/5 text-[10px] text-gray-400 font-semibold">
                  <span className="truncate max-w-[140px] text-gray-300">{cat.badge}</span>
                  <div className="flex items-center gap-1 group-hover:translate-x-1 transition text-red-400">
                    <span>Explore</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Empty Search State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <Search className="w-10 h-10 text-gray-600 mx-auto" />
            <h4 className="text-base font-bold text-gray-300">No category matched "{searchQuery}"</h4>
            <p className="text-xs text-gray-400">Try searching for "Bollywood", "Hindi Dubbed", "Anime", or "Netflix".</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGroup('all');
                setFilterType('all');
              }}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg cursor-pointer"
            >
              Reset Filters / सभी श्रेणियां दिखाएं
            </button>
          </div>
        )}

        {/* Footer Technical & Legal Badges */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Cloudflare Fast Edge CDN • Google SEO Indexed • GitHub Ready</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-gray-400">Total 128 Worldwide Categories</span>
            <span className="text-gray-500">•</span>
            <span className="text-emerald-400 font-bold">20 Zero-Sandbox Servers</span>
            <span className="text-gray-500">•</span>
            <span className="text-amber-400 font-bold">Adsterra Smart Ads Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
