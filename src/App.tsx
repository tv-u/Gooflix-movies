import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CategoryId, MovieOrShow, SouthSubcategory, WatchlistItem } from './types';
import { CATEGORIES } from './services/categories';
import {
  fetchCategoryContent,
  deduplicateItems,
} from './services/tmdb';
import { getTranslation } from './services/i18n';
import { openCleanPlayWindow, openCleanPlayerWindow, openCleanDownloadWindow } from './services/cleanWindow';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryBar } from './components/CategoryBar';
import { MovieCard } from './components/MovieCard';
import { Top100Hub } from './components/Top100Hub';
import { ContinueWatching } from './components/ContinueWatching';
import { PlayerModal } from './components/PlayerModal';
import { DetailsModal } from './components/DetailsModal';
import { DownloadModal } from './components/DownloadModal';
import { ServersModal } from './components/ServersModal';
import { DrawerModal } from './components/DrawerModal';
import { MandatoryPages, MandatoryPageId } from './components/MandatoryPages';
import { SmartAdsterra } from './components/SmartAdsterra';
import { LanguageModal } from './components/LanguageModal';
import { ShareModal } from './components/ShareModal';
import { SeoFooter } from './components/SeoFooter';
import { MobileBottomNav } from './components/MobileBottomNav';
import { EntryPopupNotification } from './components/EntryPopupNotification';
import {
  Flame,
  Film,
  Sparkles,
  Loader2,
  CheckCircle2,
  Trophy,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface HistoryItem {
  id: number;
  title: string;
  poster_path: string | null;
  media_type: 'movie' | 'tv';
  timestamp: number;
}

export default function App() {
  // Navigation View ('home' | 'top_100' | 'categories' | 'movies' | 'tv' | 'bollywood' | 'anime' | 'top_rated' | mandatory pages)
  const [activeTab, setActiveTab] = useState<string>('home');
  const [mandatoryPage, setMandatoryPage] = useState<MandatoryPageId | null>(null);

  // Category State (for the 12 New Categories + World Cinema)
  const [activeCategory, setActiveCategory] = useState<CategoryId>('hindi-movies');
  const [activeSouthSubcategory, setActiveSouthSubcategory] = useState<SouthSubcategory>('all');
  const [categoryItems, setCategoryItems] = useState<MovieOrShow[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [isLoadingCategory, setIsLoadingCategory] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [autoInfiniteScroll, setAutoInfiniteScroll] = useState<boolean>(true);
  const [jumpPageInput, setJumpPageInput] = useState<string>('');

  // Home Rails Data
  const [heroMedia, setHeroMedia] = useState<MovieOrShow | null>(null);
  const [trendingItems, setTrendingItems] = useState<MovieOrShow[]>([]);
  const [nowPlayingItems, setNowPlayingItems] = useState<MovieOrShow[]>([]);
  const [bollywoodItems, setBollywoodItems] = useState<MovieOrShow[]>([]);
  const [tvPopularItems, setTvPopularItems] = useState<MovieOrShow[]>([]);
  const [trendingWindow, setTrendingWindow] = useState<'day' | 'week'>('day');
  const [isLoadingHome, setIsLoadingHome] = useState<boolean>(true);

  // Servers State (20 servers)
  const [currentServerIndex, setCurrentServerIndex] = useState<number>(0);

  // Modals & Drawers
  const [playingMedia, setPlayingMedia] = useState<MovieOrShow | null>(null);
  const [detailsMedia, setDetailsMedia] = useState<MovieOrShow | null>(null);
  const [downloadMedia, setDownloadMedia] = useState<MovieOrShow | null>(null);
  const [isServersModalOpen, setIsServersModalOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerDefaultTab, setDrawerDefaultTab] = useState<'watchlist' | 'history'>('watchlist');
  const [isLangModalOpen, setIsLangModalOpen] = useState<boolean>(false);
  const [shareMedia, setShareMedia] = useState<MovieOrShow | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showEntryPopup, setShowEntryPopup] = useState<boolean>(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Smart Ads
  const [showStickyAd, setShowStickyAd] = useState<boolean>(true);

  // LocalStorage Watchlist
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('gootv_watchlist') || localStorage.getItem('goo_tv_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // LocalStorage History
  const [historyList, setHistoryList] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('gootv_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 50-Language state
  const [currentLang, setCurrentLang] = useState<string>(() => {
    return localStorage.getItem('gootv_lang') || 'en';
  });

  const t = getTranslation(currentLang);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Save watchlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gootv_watchlist', JSON.stringify(watchlist));
    } catch (e) {
      console.warn('Could not save watchlist', e);
    }
  }, [watchlist]);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gootv_history', JSON.stringify(historyList));
    } catch (e) {
      console.warn('Could not save history', e);
    }
  }, [historyList]);

  const handleSelectLang = (code: string) => {
    setCurrentLang(code);
    localStorage.setItem('gootv_lang', code);
  };

  // Watchlist operations
  const isInWatchlist = (id: number) => watchlist.some((w) => w.item.id === id);

  const handleToggleWatchlist = (item: MovieOrShow) => {
    setWatchlist((prev) => {
      if (prev.some((w) => w.item.id === item.id)) {
        return prev.filter((w) => w.item.id !== item.id);
      }
      return [{ item, addedAt: Date.now() }, ...prev];
    });
  };

  const handleRemoveWatchlist = (id: number) => {
    setWatchlist((prev) => prev.filter((w) => w.item.id !== id));
  };

  // History operations
  const saveToHistory = (item: MovieOrShow) => {
    setHistoryList((prev) => {
      const filtered = prev.filter((h) => h.id !== item.id);
      const isTv = item.media_type === 'tv' || (!item.title && !!item.name);
      const newEntry: HistoryItem = {
        id: item.id,
        title: item.title || item.name || 'Untitled',
        poster_path: item.poster_path,
        media_type: isTv ? 'tv' : 'movie',
        timestamp: Date.now(),
      };
      const updated = [newEntry, ...filtered];
      return updated.slice(0, 30);
    });
  };

  // Play movie & record history
  const handlePlayMovie = (item: MovieOrShow) => {
    saveToHistory(item);
    setPlayingMedia(item);
    document.title = `▶ Watch ${item.title || item.name} (4K 1080p) - GOO TV`;
  };

  // Clean Window Popup Player action
  const handleOpenPopupDirect = (item: MovieOrShow) => {
    saveToHistory(item);
    openCleanPlayerWindow(item, 1, 1, item.isDubbedHindi ? 'hi' : undefined);
    showToast('🎬 Clean Popup Window opened for direct high-speed playback!');
  };

  // 1. Load Initial Home Screen Data matching standalone.html
  useEffect(() => {
    async function loadHome() {
      setIsLoadingHome(true);
      try {
        const [trendingRes, nowPlayingRes, bollywoodRes, tvRes] = await Promise.all([
          fetchCategoryContent('trending', 'all', 1),
          fetchCategoryContent('english-movies', 'all', 1),
          fetchCategoryContent('hindi-movies', 'all', 1),
          fetchCategoryContent('k-drama', 'all', 1),
        ]);

        setTrendingItems(deduplicateItems([], trendingRes.items));
        setNowPlayingItems(deduplicateItems([], nowPlayingRes.items));
        setBollywoodItems(deduplicateItems([], bollywoodRes.items));
        setTvPopularItems(deduplicateItems([], tvRes.items));

        if (trendingRes.items.length > 0) {
          setHeroMedia(trendingRes.items[0]);
        }
      } catch (err) {
        console.warn('Failed to load home rails:', err);
      } finally {
        setIsLoadingHome(false);
      }
    }

    loadHome();
  }, [trendingWindow]);

  // 2. Load Category Specific Content with Real TMDB Metadata, Pagination & Deduplication
  const loadCategory = useCallback(
    async (catId: CategoryId, southSub: SouthSubcategory, pageNum = 1, append = false) => {
      if (pageNum === 1) {
        setIsLoadingCategory(true);
      } else {
        setIsLoadingMore(true);
      }
      setCategoryError(null);

      try {
        const res = await fetchCategoryContent(catId, southSub, pageNum);

        if (append) {
          setCategoryItems((prev) => deduplicateItems(prev, res.items));
        } else {
          setCategoryItems(deduplicateItems([], res.items));
        }

        setPage(res.page);
        setTotalPages(res.totalPages);
        setTotalResults(res.totalResults);
      } catch (err: any) {
        setCategoryError(err.message || 'Failed to load category metadata');
      } finally {
        setIsLoadingCategory(false);
        setIsLoadingMore(false);
      }
    },
    []
  );

  // Trigger category load whenever active category or subcategory changes
  useEffect(() => {
    loadCategory(activeCategory, activeSouthSubcategory, 1, false);
  }, [activeCategory, activeSouthSubcategory, loadCategory]);

  // Unlimited Upstream Pagination: Load More (Appends)
  const handleLoadMoreCategory = () => {
    if (page < totalPages && !isLoadingMore) {
      loadCategory(activeCategory, activeSouthSubcategory, page + 1, true);
    }
  };

  // Unlimited Next Page Navigation (Smoothly transitions to next page of 20 titles)
  const handleNextPageCategory = () => {
    if (page < totalPages && !isLoadingCategory) {
      const nextPage = page + 1;
      loadCategory(activeCategory, activeSouthSubcategory, nextPage, false);
      const elem = document.getElementById('category-movies-section');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }
    }
  };

  // Unlimited Previous Page Navigation
  const handlePrevPageCategory = () => {
    if (page > 1 && !isLoadingCategory) {
      const prevPage = page - 1;
      loadCategory(activeCategory, activeSouthSubcategory, prevPage, false);
      const elem = document.getElementById('category-movies-section');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }
    }
  };

  // Jump to specific page
  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpPageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      loadCategory(activeCategory, activeSouthSubcategory, p, false);
      setJumpPageInput('');
      const elem = document.getElementById('category-movies-section');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }
    }
  };

  // Infinite Scroll Trigger (Sentinel Observer)
  useEffect(() => {
    if (!autoInfiniteScroll || page >= totalPages || isLoadingMore || isLoadingCategory) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMoreCategory();
        }
      },
      { rootMargin: '300px' }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [autoInfiniteScroll, page, totalPages, isLoadingMore, isLoadingCategory]);

  const handleSelectCategory = (id: CategoryId) => {
    setMandatoryPage(null);
    setActiveCategory(id);
    if (id !== 'south-movies') {
      setActiveSouthSubcategory('all');
    }
    const cat = CATEGORIES.find((c) => c.id === id);
    if (cat) {
      document.title = `GOO TV - ${cat.label} (Stream Free in 4K HDR)`;
    }
  };

  // Tab switching logic
  const handleTabSwitch = (tabId: string) => {
    setMandatoryPage(null);
    setActiveTab(tabId);
    if (tabId === 'bollywood') {
      setActiveCategory('hindi-movies');
    } else if (tabId === 'movies') {
      setActiveCategory('english-movies');
    } else if (tabId === 'tv') {
      setActiveCategory('k-drama');
    } else if (tabId === 'top_rated') {
      setActiveCategory('classic-movies');
    } else if (tabId === 'anime') {
      setActiveCategory('japanese-anime');
    } else if (tabId === 'top_100') {
      document.title = 'GOO TV - Top 100 All-Time Global Blockbusters';
    } else if (tabId === 'home') {
      document.title = 'GOO TV - Watch Unlimited Movies, Web Series & K-Drama Free 4K';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenMandatoryPage = (pId: MandatoryPageId) => {
    setMandatoryPage(pId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = `GOO TV - ${pId.toUpperCase()} & Official Policies`;
  };

  const activeCategoryDef = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c10] text-[#f3f4f6] font-sans selection:bg-red-600 selection:text-white antialiased overflow-x-hidden pb-16 md:pb-0">
      {/* Top Header Navbar with Notification Ticker */}
      <Navbar
        activeTab={mandatoryPage ? '' : activeTab}
        onSelectTab={handleTabSwitch}
        onSelectCategory={handleSelectCategory}
        currentServerIndex={currentServerIndex}
        onOpenServersModal={() => setIsServersModalOpen(true)}
        watchlistCount={watchlist.length}
        onOpenWatchlist={() => {
          setDrawerDefaultTab('watchlist');
          setIsDrawerOpen(true);
        }}
        currentLang={currentLang}
        onOpenLangModal={() => setIsLangModalOpen(true)}
        onPlayMovie={handlePlayMovie}
        onOpenCleanGuide={() => handleOpenMandatoryPage('cleanwindow_guide')}
        onOpenShare={() => {
          setShareMedia(heroMedia || (trendingItems[0] || null));
          setIsShareModalOpen(true);
        }}
      />

      {/* Main Container with offset for fixed header */}
      <main className="flex-1 mt-24 sm:mt-28">
        {/* If viewing a Mandatory Page */}
        {mandatoryPage ? (
          <MandatoryPages
            pageId={mandatoryPage}
            onSelectCategory={handleSelectCategory}
            onBackToHome={() => {
              setMandatoryPage(null);
              setActiveTab('home');
            }}
          />
        ) : activeTab === 'top_100' ? (
          /* TOP 100 ALL-TIME GLOBAL BLOCKBUSTERS HUB */
          <Top100Hub
            onPlay={handlePlayMovie}
            onOpenDetails={setDetailsMedia}
            onOpenPopup={handleOpenPopupDirect}
            isInWatchlist={isInWatchlist}
            onToggleWatchlist={handleToggleWatchlist}
          />
        ) : activeTab === 'home' ? (
          /* HOME SCREEN CONTAINER matching standalone.html */
          <div id="homeScreen">
            {/* HERO BILLBOARD + ADSTERRA SPONSORED BANNER - Live HD Updating Posters */}
            <HeroBanner
              featuredItems={trendingItems.length > 0 ? trendingItems : [heroMedia].filter(Boolean) as MovieOrShow[]}
              activeMedia={heroMedia}
              onPlay={handlePlayMovie}
              onOpenDetails={setDetailsMedia}
              onToast={showToast}
            />

            {/* Smart 728x90 Adsterra Leaderboard Slot */}
            <SmartAdsterra placement="leaderboard-728" />

            {/* CONTINUE WATCHING ROW matching standalone.html */}
            <ContinueWatching
              historyList={historyList}
              onPlay={handlePlayMovie}
              onViewAllHistory={() => {
                setDrawerDefaultTab('history');
                setIsDrawerOpen(true);
              }}
            />

            {/* TRENDING HEADER WITH DAY / WEEK TOGGLE matching standalone.html */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-red-600/10 text-red-500 border border-red-500/20">
                  <Flame className="w-4 h-4" />
                </span>
                <h2 className="text-xl font-black text-white">Trending Movies & Shows</h2>
              </div>
              <div className="flex items-center bg-white/5 p-0.5 rounded-xl border border-white/10 text-xs font-bold">
                <button
                  onClick={() => setTrendingWindow('day')}
                  className={`px-3 py-1 rounded-lg transition ${
                    trendingWindow === 'day' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setTrendingWindow('week')}
                  className={`px-3 py-1 rounded-lg transition ${
                    trendingWindow === 'week' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  This Week
                </button>
              </div>
            </div>

            {/* HOME RAILS CONTAINER matching standalone.html */}
            <div className="space-y-6">
              {/* Row 1: Trending Hits */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <span>🔥 Trending Hits</span>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-white/10 text-red-400">
                      TRENDING
                    </span>
                  </h3>
                </div>
                <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none">
                  {trendingItems.map((item) => (
                    <div key={`trend-${item.id}`} className="shrink-0 w-36 sm:w-44 md:w-48">
                      <MovieCard
                        item={item}
                        onPlay={handlePlayMovie}
                        onOpenDetails={setDetailsMedia}
                        onOpenPopup={handleOpenPopupDirect}
                        isInWatchlist={isInWatchlist(item.id)}
                        onToggleWatchlist={handleToggleWatchlist}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 2: In Theaters & Hollywood Hits */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <span>🎬 In Theaters & Hollywood Hits</span>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-white/10 text-red-400">
                      NEW 4K
                    </span>
                  </h3>
                </div>
                <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none">
                  {nowPlayingItems.map((item) => (
                    <div key={`now-${item.id}`} className="shrink-0 w-36 sm:w-44 md:w-48">
                      <MovieCard
                        item={item}
                        onPlay={handlePlayMovie}
                        onOpenDetails={setDetailsMedia}
                        onOpenPopup={handleOpenPopupDirect}
                        isInWatchlist={isInWatchlist(item.id)}
                        onToggleWatchlist={handleToggleWatchlist}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 3: Bollywood & Hindi Blockbusters */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <span>🇮🇳 Bollywood & Hindi Blockbusters</span>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-white/10 text-red-400">
                      HINDI
                    </span>
                  </h3>
                </div>
                <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none">
                  {bollywoodItems.map((item) => (
                    <div key={`bolly-${item.id}`} className="shrink-0 w-36 sm:w-44 md:w-48">
                      <MovieCard
                        item={item}
                        onPlay={handlePlayMovie}
                        onOpenDetails={setDetailsMedia}
                        onOpenPopup={handleOpenPopupDirect}
                        isInWatchlist={isInWatchlist(item.id)}
                        onToggleWatchlist={handleToggleWatchlist}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 4: Popular TV & K-Dramas */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <span>📺 Popular Series & K-Dramas</span>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-white/10 text-red-400">
                      SERIES
                    </span>
                  </h3>
                </div>
                <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none">
                  {tvPopularItems.map((item) => (
                    <div key={`tv-${item.id}`} className="shrink-0 w-36 sm:w-44 md:w-48">
                      <MovieCard
                        item={item}
                        onPlay={handlePlayMovie}
                        onOpenDetails={setDetailsMedia}
                        onOpenPopup={handleOpenPopupDirect}
                        isInWatchlist={isInWatchlist(item.id)}
                        onToggleWatchlist={handleToggleWatchlist}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* UNLIMITED PAGINATION & CATEGORIES SECTION */}
            <div className="mt-12 border-t border-white/10 pt-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-red-600/10 text-red-500 border border-red-500/20">
                      <Film className="w-4 h-4" />
                    </span>
                    <div>
                      <h2 className="text-xl font-black text-white">
                        Worldwide Cinema Categories & Unlimited Pagination
                      </h2>
                      <p className="text-xs text-gray-400">
                        Explore all world cinema • Continuous Upstream API Pagination (Pages 1 to 1000+)
                      </p>
                    </div>
                  </div>

                  {/* Auto-Infinite Scroll Toggle */}
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-gray-300 font-semibold">Auto-Infinite Scroll:</span>
                    <button
                      onClick={() => setAutoInfiniteScroll(!autoInfiniteScroll)}
                      className={`font-black text-[11px] px-2 py-0.5 rounded transition cursor-pointer ${
                        autoInfiniteScroll
                          ? 'bg-emerald-500 text-black'
                          : 'bg-white/10 text-gray-400'
                      }`}
                    >
                      {autoInfiniteScroll ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Category Strip */}
              <CategoryBar
                activeCategory={activeCategory}
                onSelectCategory={handleSelectCategory}
                activeSouthSubcategory={activeSouthSubcategory}
                onSelectSouthSubcategory={setActiveSouthSubcategory}
              />

              {/* Category Content Grid with Section ID */}
              <div id="category-movies-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scroll-mt-24">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 mb-6 gap-3">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <span>{activeCategoryDef?.icon} {activeCategoryDef?.label}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300">
                        {activeCategoryDef?.badge}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">{activeCategoryDef?.description}</p>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-mono text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg">
                      Page {page} of {totalPages}
                    </span>
                    <span className="text-emerald-400 font-semibold hidden sm:inline">
                      • {categoryItems.length} Titles Loaded
                    </span>
                  </div>
                </div>

                {isLoadingCategory ? (
                  <div className="py-24 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                    <span className="text-xs text-gray-400">Fetching verified TMDB upstream titles...</span>
                  </div>
                ) : categoryError ? (
                  <div className="py-16 text-center text-red-400 text-xs">{categoryError}</div>
                ) : categoryItems.length === 0 ? (
                  <div className="py-16 text-center text-gray-400 text-xs">
                    No upstream metadata available for this category.
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                      {categoryItems.map((item) => (
                        <MovieCard
                          key={`cat-${item.id}`}
                          item={item}
                          onPlay={handlePlayMovie}
                          onOpenDetails={setDetailsMedia}
                          onOpenPopup={handleOpenPopupDirect}
                          isInWatchlist={isInWatchlist(item.id)}
                          onToggleWatchlist={handleToggleWatchlist}
                        />
                      ))}
                    </div>

                    {/* Sentinel for auto infinite scrolling */}
                    <div ref={sentinelRef} className="h-6 w-full" />

                    {/* Enhanced Unlimited Load More & Next Button Toolbar */}
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/15 rounded-3xl p-5 sm:p-6 max-w-3xl mx-auto shadow-2xl backdrop-blur-xl">
                      <div className="text-center space-y-1">
                        <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>Unlimited Continuous Stream ({categoryItems.length} Titles Loaded)</span>
                        </span>
                        <p className="text-[11px] text-gray-400">
                          Verified TMDB API Stream • Page {page} of {totalPages} (Unlimited Pages)
                        </p>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap justify-center w-full">
                        {/* Previous Page Button */}
                        {page > 1 && (
                          <button
                            onClick={handlePrevPageCategory}
                            disabled={isLoadingCategory}
                            className="px-4 sm:px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer disabled:opacity-40"
                            title="Previous Page / पिछला पेज"
                          >
                            <ChevronLeft className="w-4 h-4 stroke-[3]" />
                            <span>Previous (पिछला पेज)</span>
                          </button>
                        )}

                        {/* Dedicated 3D Highlight Next Page Button */}
                        {page < totalPages && (
                          <button
                            onClick={handleNextPageCategory}
                            disabled={isLoadingCategory}
                            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xl shadow-red-600/50 hover:shadow-red-600/70 border border-white/20 transition-all transform active:scale-95 cursor-pointer disabled:opacity-50"
                            title="Next Page / अगला पेज (अनलिमिटेड)"
                          >
                            <span>Next Page (अगला पेज ❯)</span>
                            <ChevronRight className="w-4 h-4 stroke-[3]" />
                          </button>
                        )}

                        {/* Load More Continuous Button */}
                        {page < totalPages && (
                          <button
                            onClick={handleLoadMoreCategory}
                            disabled={isLoadingMore}
                            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-50"
                            title="Continuous Load More (और फिल्में लोड करें)"
                          >
                            {isLoadingMore ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin text-white" />
                                <span>Loading...</span>
                              </>
                            ) : (
                              <>
                                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                                <span>+ Load More (और लोड करें)</span>
                              </>
                            )}
                          </button>
                        )}

                        {/* Jump to page form */}
                        <form onSubmit={handleJumpToPage} className="flex items-center gap-1.5 text-xs">
                          <input
                            type="number"
                            placeholder="Page #"
                            min="1"
                            max={totalPages}
                            value={jumpPageInput}
                            onChange={(e) => setJumpPageInput(e.target.value)}
                            className="w-16 bg-[#161824] border border-white/15 rounded-xl px-2 py-2.5 text-center text-white text-xs focus:outline-none focus:border-red-500 font-mono"
                          />
                          <button
                            type="submit"
                            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer transition border border-white/10"
                          >
                            Go
                          </button>
                        </form>
                      </div>

                      <div className="flex items-center justify-between w-full text-[11px] text-gray-500 pt-2 border-t border-white/5">
                        <span>Auto-Scroll: {autoInfiniteScroll ? '🟢 Active' : '⚪ Paused'}</span>
                        <span>Showing {categoryItems.length} Titles</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* DEDICATED EXPLORE & CATEGORIES VIEW */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CategoryBar
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
              activeSouthSubcategory={activeSouthSubcategory}
              onSelectSouthSubcategory={setActiveSouthSubcategory}
            />

            <div className="mt-8">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <span>{activeCategoryDef?.icon} {activeCategoryDef?.label}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300">
                      {activeCategoryDef?.badge}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">{activeCategoryDef?.description}</p>
                </div>
                <span className="text-xs font-mono text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg">
                  Upstream Page {page} of {totalPages}
                </span>
              </div>

              {isLoadingCategory ? (
                <div className="py-24 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                  <span className="text-xs text-gray-400">Loading TMDB titles...</span>
                </div>
              ) : categoryError ? (
                <div className="py-16 text-center text-red-400 text-xs">{categoryError}</div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                    {categoryItems.map((item) => (
                      <MovieCard
                        key={`grid-${item.id}`}
                        item={item}
                        onPlay={handlePlayMovie}
                        onOpenDetails={setDetailsMedia}
                        onOpenPopup={handleOpenPopupDirect}
                        isInWatchlist={isInWatchlist(item.id)}
                        onToggleWatchlist={handleToggleWatchlist}
                      />
                    ))}
                  </div>

                  {/* Sentinel */}
                  <div ref={sentinelRef} className="h-6 w-full" />

                  {/* Unlimited Pagination Controls */}
                  <div className="mt-12 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/15 rounded-3xl p-5 sm:p-6 max-w-3xl mx-auto shadow-2xl backdrop-blur-xl">
                    <div className="text-center space-y-1">
                      <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Unlimited Continuous Stream ({categoryItems.length} Titles Loaded)</span>
                      </span>
                      <p className="text-[11px] text-gray-400">
                        Page {page} of {totalPages} • Auto-Infinite Scroll Active (Unlimited Pages)
                      </p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap justify-center w-full">
                      {/* Previous Page Button */}
                      {page > 1 && (
                        <button
                          onClick={handlePrevPageCategory}
                          disabled={isLoadingCategory}
                          className="px-4 sm:px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer disabled:opacity-40"
                          title="Previous Page / पिछला पेज"
                        >
                          <ChevronLeft className="w-4 h-4 stroke-[3]" />
                          <span>Previous (पिछला पेज)</span>
                        </button>
                      )}

                      {/* Dedicated 3D Highlight Next Page Button */}
                      {page < totalPages && (
                        <button
                          onClick={handleNextPageCategory}
                          disabled={isLoadingCategory}
                          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xl shadow-red-600/50 hover:shadow-red-600/70 border border-white/20 transition-all transform active:scale-95 cursor-pointer disabled:opacity-50"
                          title="Next Page / अगला पेज (अनलिमिटेड)"
                        >
                          <span>Next Page (अगला पेज ❯)</span>
                          <ChevronRight className="w-4 h-4 stroke-[3]" />
                        </button>
                      )}

                      {/* Load More Continuous Button */}
                      {page < totalPages && (
                        <button
                          onClick={handleLoadMoreCategory}
                          disabled={isLoadingMore}
                          className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-50"
                          title="Continuous Load More (और फिल्में लोड करें)"
                        >
                          {isLoadingMore ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                              <span>Loading...</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                              <span>+ Load More (और लोड करें)</span>
                            </>
                          )}
                        </button>
                      )}

                      {/* Jump to page form */}
                      <form onSubmit={handleJumpToPage} className="flex items-center gap-1.5 text-xs">
                        <input
                          type="number"
                          placeholder="Page #"
                          min="1"
                          max={totalPages}
                          value={jumpPageInput}
                          onChange={(e) => setJumpPageInput(e.target.value)}
                          className="w-16 bg-[#161824] border border-white/15 rounded-xl px-2 py-2.5 text-center text-white text-xs focus:outline-none focus:border-red-500 font-mono"
                        />
                        <button
                          type="submit"
                          className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer transition border border-white/10"
                        >
                          Go
                        </button>
                      </form>
                    </div>

                    <div className="flex items-center justify-between w-full text-[11px] text-gray-500 pt-2 border-t border-white/5">
                      <span>Continuous Stream • Page {page} of {totalPages}</span>
                      <span>{categoryItems.length} Titles in Memory</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* 20 SERVERS STATUS MODAL matching standalone.html */}
      <ServersModal
        isOpen={isServersModalOpen}
        onClose={() => setIsServersModalOpen(false)}
        currentServerIndex={currentServerIndex}
        onSelectServer={setCurrentServerIndex}
      />

      {/* CINEMA VIDEO PLAYER MODAL matching standalone.html */}
      {playingMedia && (
        <PlayerModal
          item={playingMedia}
          onClose={() => setPlayingMedia(null)}
          onOpenDownload={setDownloadMedia}
        />
      )}

      {/* MOVIE DETAILS MODAL matching standalone.html */}
      {detailsMedia && (
        <DetailsModal
          item={detailsMedia}
          onClose={() => setDetailsMedia(null)}
          onPlay={handlePlayMovie}
          onOpenDownload={setDownloadMedia}
          onOpenShare={(m) => {
            setShareMedia(m);
            setIsShareModalOpen(true);
          }}
        />
      )}

      {/* MULTI-QUALITY DOWNLOAD MODAL matching standalone.html */}
      {downloadMedia && (
        <DownloadModal
          media={downloadMedia}
          onClose={() => setDownloadMedia(null)}
        />
      )}

      {/* SHARE MODAL WITH EXPANDED SOCIAL CHANNELS */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        media={shareMedia}
      />

      {/* WATCHLIST & HISTORY DRAWER matching standalone.html */}
      <DrawerModal
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        defaultTab={drawerDefaultTab}
        watchlist={watchlist}
        historyList={historyList}
        onPlay={handlePlayMovie}
        onRemoveWatchlist={handleRemoveWatchlist}
        onClearWatchlist={() => setWatchlist([])}
        onClearHistory={() => setHistoryList([])}
      />

      {/* 50-LANGUAGE SELECTION MODAL */}
      <LanguageModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        selectedLang={currentLang}
        onSelectLang={handleSelectLang}
      />

      {/* 5-SECOND FULLSCREEN 3D NOTIFICATION POPUP (Requested by user) */}
      {showEntryPopup && (
        <EntryPopupNotification
          onClose={() => setShowEntryPopup(false)}
          onOpenCleanWindowGuide={() => {
            setShowEntryPopup(false);
            handleOpenMandatoryPage('cleanwindow_guide');
          }}
        />
      )}

      {/* STICKY SMART ADSTERRA ON MOBILE */}
      {showStickyAd && (
        <SmartAdsterra
          placement="sticky-bottom"
          onClose={() => setShowStickyAd(false)}
        />
      )}

      {/* MOBILE BOTTOM NAVIGATION */}
      <MobileBottomNav
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        onOpenSearch={() => {
          setMandatoryPage(null);
          setActiveTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        watchlistCount={watchlist.length}
        onOpenWatchlist={() => {
          setDrawerDefaultTab('watchlist');
          setIsDrawerOpen(true);
        }}
      />

      {/* FOOTER matching standalone.html with Mandatory Pages Triggers */}
      <SeoFooter
        onSelectCategory={handleSelectCategory}
        onOpenPolicy={(p) => handleOpenMandatoryPage(p)}
        onOpenLangModal={() => setIsLangModalOpen(true)}
        onOpenServersModal={() => setIsServersModalOpen(true)}
        onOpenShare={() => {
          setShareMedia(heroMedia || (trendingItems[0] || null));
          setIsShareModalOpen(true);
        }}
      />

      {/* FLOATING ACTION TOAST */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-2xl animate-in slide-in-from-top duration-200 border border-amber-400/40 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
