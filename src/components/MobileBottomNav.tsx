import React from 'react';
import { Home, Grid, Search, Bookmark } from 'lucide-react';
import { CategoryId } from '../types';

interface MobileBottomNavProps {
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  onOpenSearch: () => void;
  watchlistCount: number;
  onOpenWatchlist: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenSearch,
  watchlistCount,
  onOpenWatchlist,
}) => {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0c12]/95 backdrop-blur-xl border-t border-gray-800/90 px-4 py-2 flex items-center justify-around shadow-2xl">
      {/* Home */}
      <button
        onClick={() => onSelectCategory('trending')}
        className={`flex flex-col items-center gap-1 transition ${
          activeCategory === 'trending' ? 'text-red-500' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Home</span>
      </button>

      {/* Categories */}
      <button
        onClick={() => onSelectCategory('hindi-movies')}
        className={`flex flex-col items-center gap-1 transition ${
          activeCategory !== 'trending' ? 'text-red-500' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Categories</span>
      </button>

      {/* Search */}
      <button
        onClick={onOpenSearch}
        className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-200 transition"
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Search</span>
      </button>

      {/* Watchlist */}
      <button
        onClick={onOpenWatchlist}
        className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-200 transition relative"
      >
        <Bookmark className="w-5 h-5 text-amber-400" />
        {watchlistCount > 0 && (
          <span className="absolute -top-1 right-2 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
            {watchlistCount}
          </span>
        )}
        <span className="text-[10px] font-semibold">Watchlist</span>
      </button>
    </nav>
  );
};
