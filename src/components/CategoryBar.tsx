import React, { useRef, useState } from 'react';
import { CATEGORIES, CATEGORY_GROUPS } from '../services/categories';
import { CategoryId, CategoryGroup, SouthSubcategory } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Grid,
  X,
  Search,
  Sparkles,
  Flame,
  Film,
  Tv,
} from 'lucide-react';

interface CategoryBarProps {
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  activeSouthSubcategory: SouthSubcategory;
  onSelectSouthSubcategory: (sub: SouthSubcategory) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  activeCategory,
  onSelectCategory,
  activeSouthSubcategory,
  onSelectSouthSubcategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedGroup, setSelectedGroup] = useState<CategoryGroup | 'primary'>('primary');
  const [showExplorerModal, setShowExplorerModal] = useState<boolean>(false);
  const [explorerSearch, setExplorerSearch] = useState<string>('');

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const southCategoryDef = CATEGORIES.find((c) => c.id === 'south-movies');

  // Filter categories shown in the horizontal bar based on selected group
  const barCategories = CATEGORIES.filter((cat) => {
    if (selectedGroup === 'primary') {
      return cat.isPrimary;
    }
    return cat.group === selectedGroup;
  });

  // Filter categories inside the full explorer modal based on search and group
  const modalCategories = CATEGORIES.filter((cat) => {
    if (!explorerSearch.trim()) return true;
    const query = explorerSearch.toLowerCase();
    return (
      cat.label.toLowerCase().includes(query) ||
      cat.badge.toLowerCase().includes(query) ||
      cat.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full bg-[#0a0c12]/95 border-y border-white/10 sticky top-16 z-30 shadow-2xl backdrop-blur-xl select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 relative">
        {/* Row 1: 8 Worldwide Groups Chips + Full Explorer Button */}
        <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-white/5 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => setSelectedGroup('primary')}
            className={`px-3 py-1 rounded-full text-xs font-black transition cursor-pointer shrink-0 border ${
              selectedGroup === 'primary'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white border-red-500 shadow-md'
                : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'
            }`}
          >
            ⭐ Top 16 Recommended
          </button>

          {CATEGORY_GROUPS.map((grp) => {
            const isGroupActive = selectedGroup === grp.id;
            return (
              <button
                key={grp.id}
                onClick={() => setSelectedGroup(grp.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer shrink-0 border ${
                  isGroupActive
                    ? 'bg-amber-400 text-black border-amber-300 font-black shadow-md'
                    : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'
                }`}
              >
                <span>{grp.label}</span>
              </button>
            );
          })}

          {/* Full Worldwide Category Explorer Trigger */}
          <button
            onClick={() => setShowExplorerModal(true)}
            className="ml-auto px-3.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-500 text-white flex items-center gap-1.5 shrink-0 cursor-pointer shadow-lg transition"
            title="Open Complete Worldwide Category Directory"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>All Categories ({CATEGORIES.length})</span>
          </button>
        </div>

        {/* Scroll Arrows for Desktop */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-1 top-[68%] -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/90 border border-white/20 text-gray-300 hover:text-white items-center justify-center transition shadow-xl cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-1 top-[68%] -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/90 border border-white/20 text-gray-300 hover:text-white items-center justify-center transition shadow-xl cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Row 2: Scrollable Categories Strip */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 scroll-smooth"
        >
          {barCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white border-red-500 shadow-xl shadow-red-950/70 scale-[1.02]'
                    : 'bg-[#141624] text-gray-300 border-white/5 hover:border-white/20 hover:bg-[#1a1d2e]'
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive ? 'bg-black/40 text-white' : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {cat.badge.split(' • ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* South Indian Subcategories Strip (Telugu, Tamil, Malayalam, Kannada) */}
        {(activeCategory === 'south-movies' || activeCategory === 'hindi-dubbed-south') &&
          southCategoryDef?.subcategories && (
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none animate-in fade-in duration-200">
              <span className="text-xs font-bold text-gray-400 whitespace-nowrap mr-1 flex items-center gap-1">
                🌴 South Industries:
              </span>
              {southCategoryDef.subcategories.map((sub) => {
                const isSubActive = activeSouthSubcategory === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => onSelectSouthSubcategory(sub.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                      isSubActive
                        ? 'bg-amber-400 text-black border-amber-300 font-black shadow-sm'
                        : 'bg-[#181b28] text-gray-300 border-white/10 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {sub.label}
                  </button>
                );
              })}
            </div>
          )}
      </div>

      {/* COMPLETE WORLDWIDE CATEGORIES EXPLORER MODAL */}
      {showExplorerModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl bg-[#0f111c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    🌍 GOO TV Worldwide Category Directory ({CATEGORIES.length} Categories)
                  </h3>
                  <p className="text-xs text-gray-400">
                    Discover movies and series by trending, industry, original language, dubbing, OTT, and genres
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExplorerModal(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input within Categories */}
            <div className="relative shrink-0">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search categories (e.g. Anime, Korean, Action, Netflix, Tamil, Sci-Fi)..."
                value={explorerSearch}
                onChange={(e) => setExplorerSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-black/90"
              />
            </div>

            {/* Categories Content Grid grouped by Category Groups */}
            <div className="overflow-y-auto flex-1 pr-1 space-y-6">
              {CATEGORY_GROUPS.map((grp) => {
                const groupCats = modalCategories.filter((c) => c.group === grp.id);
                if (groupCats.length === 0) return null;

                return (
                  <div key={grp.id} className="space-y-2.5">
                    <div className="flex items-center gap-2 pb-1 border-b border-white/5">
                      <span className="text-sm">{grp.icon}</span>
                      <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">
                        {grp.label} ({groupCats.length})
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {groupCats.map((cat) => {
                        const isActive = activeCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => {
                              onSelectCategory(cat.id);
                              setShowExplorerModal(false);
                            }}
                            className={`flex flex-col justify-between p-3 rounded-2xl text-left transition border cursor-pointer ${
                              isActive
                                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white border-red-500 shadow-lg shadow-red-950/70'
                                : 'bg-white/5 hover:bg-white/10 text-gray-200 border-white/5 hover:border-white/15'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-xl shrink-0">{cat.icon}</span>
                              <div className="min-w-0 flex-1">
                                <span className="font-extrabold text-xs block truncate text-white">
                                  {cat.label}
                                </span>
                                <span className="text-[10px] text-gray-400 block truncate mt-0.5">
                                  {cat.badge}
                                </span>
                              </div>
                            </div>
                            <span className="text-[9px] text-gray-500 line-clamp-1 mt-2">
                              {cat.description}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
