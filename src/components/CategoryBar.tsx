import React, { useRef, useState } from 'react';
import { CATEGORIES } from '../services/categories';
import { CategoryId, SouthSubcategory } from '../types';
import { ChevronLeft, ChevronRight, Sparkles, Globe, Trophy, Film } from 'lucide-react';

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
  const [filterGroup, setFilterGroup] = useState<'all' | 'indian' | 'world' | 'ott'>('all');

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const southCategoryDef = CATEGORIES.find((c) => c.id === 'south-movies');

  // Filter categories based on group
  const displayedCategories = CATEGORIES.filter((cat) => {
    if (filterGroup === 'all') return true;
    if (filterGroup === 'indian') {
      return ['hindi-movies', 'punjabi-movies', 'south-movies', 'hindi-dubbed-movies', 'classic-movies'].includes(cat.id);
    }
    if (filterGroup === 'world') {
      return cat.isWorldCinema || ['english-movies', 'k-drama', 'hindi-dubbed-kdrama'].includes(cat.id);
    }
    if (filterGroup === 'ott') {
      return ['netflix-movies', 'hbo-movies', 'jiohotstar-movies', 'mxplayer-movies'].includes(cat.id);
    }
    return true;
  });

  return (
    <div className="w-full bg-[#0a0c12]/95 border-y border-white/10 sticky top-16 z-30 shadow-2xl backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 relative">
        {/* Quick Filter Pill Group for Worldwide Cinema */}
        <div className="flex items-center gap-1.5 pb-2.5 mb-2 border-b border-white/5 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Filters:
          </span>
          <button
            onClick={() => setFilterGroup('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
              filterGroup === 'all'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            🔥 All Cinema ({CATEGORIES.length})
          </button>
          <button
            onClick={() => setFilterGroup('indian')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              filterGroup === 'indian'
                ? 'bg-amber-500 text-black shadow-md font-black'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <span>🇮🇳 Indian & Desi</span>
          </button>
          <button
            onClick={() => setFilterGroup('world')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              filterGroup === 'world'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>🌍 Worldwide Cinema</span>
          </button>
          <button
            onClick={() => setFilterGroup('ott')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
              filterGroup === 'ott'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            📺 OTT Specials (Netflix • HBO • Hotstar)
          </button>
        </div>

        {/* Navigation arrows for desktop */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-1 top-[60%] -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/90 border border-white/20 text-gray-300 hover:text-white items-center justify-center transition shadow-xl cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-1 top-[60%] -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/90 border border-white/20 text-gray-300 hover:text-white items-center justify-center transition shadow-xl cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Scrollable Categories Strip */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 scroll-smooth"
        >
          {displayedCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                  isActive
                    ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-950/70 scale-[1.02]'
                    : 'bg-[#151722] text-gray-300 border-white/5 hover:border-white/20 hover:bg-[#1c202e]'
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

        {/* Subcategories bar for South Movies (Tamil, Telugu, Malayalam, Kannada) */}
        {activeCategory === 'south-movies' && southCategoryDef?.subcategories && (
          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none animate-in fade-in duration-200">
            <span className="text-xs font-semibold text-gray-400 whitespace-nowrap mr-1 flex items-center gap-1">
              🌴 Filter South Cinema:
            </span>
            {southCategoryDef.subcategories.map((sub) => {
              const isSubActive = activeSouthSubcategory === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => onSelectSouthSubcategory(sub.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                    isSubActive
                      ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-sm'
                      : 'bg-[#181b26] text-gray-300 border-white/10 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
