import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MovieOrShow } from '../types';
import { SERVERS_20, PlayerServerDef } from '../services/playerServers';
import { openCleanPlayerWindow } from '../services/cleanWindow';
import { triggerAdsterraSmartAd, getAdsterraUrlByIndex } from '../services/adsterra';
import {
  X,
  Maximize2,
  Minimize2,
  Zap,
  ExternalLink,
  ShieldCheck,
  Download,
  Film,
  Tv,
  Play,
  RotateCcw,
  RotateCw,
  Sun,
  Volume2,
  VolumeX,
  Volume1,
  Subtitles,
  Sparkles,
  Server,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface PlayerModalProps {
  item: MovieOrShow | null;
  onClose: () => void;
  onOpenDownload: (item: MovieOrShow) => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
  item,
  onClose,
  onOpenDownload,
}) => {
  if (!item) return null;

  // Manual server selection state (All 20 Servers)
  const [currentServerIndex, setCurrentServerIndex] = useState<number>(0);
  const [currentSeason, setCurrentSeason] = useState<number>(1);
  const [currentEpisode, setCurrentEpisode] = useState<number>(1);

  // Advanced Player Controls
  const [quality, setQuality] = useState<string>('1080p');
  const [audioTrack, setAudioTrack] = useState<string>(item.isDubbedHindi ? 'hindi' : 'hindi');
  const [subtitle, setSubtitle] = useState<string>('off');
  const [brightness, setBrightness] = useState<number>(100); // 20% to 200% (Bilibili style)
  const [volume, setVolume] = useState<number>(100); // 0% to 200% (MX Player style)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isCleanWindowMode, setIsCleanWindowMode] = useState<boolean>(false);

  // Gesture & HUD States
  const [hudType, setHudType] = useState<'brightness' | 'volume' | 'seek' | null>(null);
  const [hudValue, setHudValue] = useState<string | number>('');
  const [seekRipple, setSeekRipple] = useState<'left' | 'right' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const playerContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hudTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const gestureSideRef = useRef<'left' | 'right' | null>(null);
  const initialGestureValRef = useRef<number>(100);

  const isTv = item.media_type === 'tv' || (!item.title && !!item.name);
  const totalSeasons = item.seasons_count || 1;
  const totalEpisodes = item.episodes_count || 12;

  // Build stream URL with audio track and server logic
  const currentServer = SERVERS_20[currentServerIndex] || SERVERS_20[0];
  const activeAudioLang = audioTrack === 'hindi' ? 'hi' : audioTrack === 'south' ? 'te' : '';

  let streamUrl = isTv
    ? currentServer.getTv(item.id, currentSeason, currentEpisode, activeAudioLang)
    : currentServer.getMovie(item.id, activeAudioLang);

  // Add subtitle parameter if active
  if (subtitle !== 'off') {
    const separator = streamUrl.includes('?') ? '&' : '?';
    streamUrl += `${separator}sub=${subtitle}&caption=1`;
  }

  // Toast Helper
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  }, []);

  // MANUAL SERVER SWITCHING ENGINE (No unexpected automatic jumps)
  const cycleNextServer = useCallback(() => {
    const nextIdx = (currentServerIndex + 1) % SERVERS_20.length;
    setCurrentServerIndex(nextIdx);
    // 100% Adsterra Monetization Trigger
    triggerAdsterraSmartAd();
    showToast(`⚡ Switched to Server ${nextIdx + 1}: ${SERVERS_20[nextIdx].name}`);
  }, [currentServerIndex, showToast]);

  const selectServer = useCallback((idx: number) => {
    setCurrentServerIndex(idx);
    // 100% Adsterra Monetization Trigger
    triggerAdsterraSmartAd();
    showToast(`⚡ Connected to Server ${idx + 1}: ${SERVERS_20[idx].name}`);
  }, [showToast]);

  // HUD notification helper
  const triggerHud = (type: 'brightness' | 'volume' | 'seek', val: string | number) => {
    setHudType(type);
    setHudValue(val);
    if (hudTimeoutRef.current) clearTimeout(hudTimeoutRef.current);
    hudTimeoutRef.current = setTimeout(() => {
      setHudType(null);
    }, 1500);
  };

  // Keyboard controls (+10s, -10s, F for Fullscreen, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          exitFullscreen();
        } else {
          onClose();
        }
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        skipTime(-10);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        skipTime(10);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        adjustVolume(10);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        adjustVolume(-10);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, onClose]);

  // Fullscreen listener
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // 10 Second Skip Back (-10s) and Skip Forward (+10s)
  const skipTime = (seconds: number) => {
    if (seconds > 0) {
      setSeekRipple('right');
      triggerHud('seek', `+${seconds}s`);
    } else {
      setSeekRipple('left');
      triggerHud('seek', `${seconds}s`);
    }
    setTimeout(() => setSeekRipple(null), 600);

    // Attempt HTML5 video postMessage seek command
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { action: 'seek', offset: seconds },
          '*'
        );
      }
    } catch (e) {
      // Cross-origin iframe fallback
    }
  };

  // Volume Adjustment (0 - 200% MX Player Style)
  const adjustVolume = (delta: number) => {
    setVolume((prev) => {
      const next = Math.max(0, Math.min(200, prev + delta));
      triggerHud('volume', `${next}%`);
      return next;
    });
  };

  // Brightness Adjustment (20 - 200% Bilibili Style)
  const adjustBrightness = (delta: number) => {
    setBrightness((prev) => {
      const next = Math.max(20, Math.min(200, prev + delta));
      triggerHud('brightness', `${next}%`);
      return next;
    });
  };

  // Touch Gesture Handlers (Left side = Brightness, Right side = Volume)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const isLeftSide = x < rect.width / 2;

    gestureSideRef.current = isLeftSide ? 'left' : 'right';
    touchStartYRef.current = touch.clientY;
    touchStartXRef.current = touch.clientX;
    initialGestureValRef.current = isLeftSide ? brightness : volume;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartYRef.current || !gestureSideRef.current) return;
    const touch = e.touches[0];
    const deltaY = touchStartYRef.current - touch.clientY; // upward = positive
    const deltaVal = Math.round(deltaY / 2); // 2px per 1% change

    if (gestureSideRef.current === 'left') {
      const next = Math.max(20, Math.min(200, initialGestureValRef.current + deltaVal));
      setBrightness(next);
      triggerHud('brightness', `${next}%`);
    } else {
      const next = Math.max(0, Math.min(200, initialGestureValRef.current + deltaVal));
      setVolume(next);
      triggerHud('volume', `${next}%`);
    }
  };

  const handleTouchEnd = () => {
    touchStartYRef.current = null;
    touchStartXRef.current = null;
    gestureSideRef.current = null;
  };

  // Mouse wheel gesture on player
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeftSide = x < rect.width / 2;
    const delta = e.deltaY < 0 ? 5 : -5;

    if (isLeftSide) {
      adjustBrightness(delta);
    } else {
      adjustVolume(delta);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().catch((err) => console.warn(err));
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => console.warn(err));
    }
  };

  // Clean Window Popout
  const popoutCleanWindow = () => {
    triggerAdsterraSmartAd();
    openCleanPlayerWindow(
      item,
      currentSeason,
      currentEpisode,
      audioTrack === 'hindi' ? 'hi' : undefined
    );
    showToast('⚡ Clean Window Cinema launched in ad-free mode!');
  };

  const title = item.title || item.name || 'Untitled';
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-2xl flex items-center justify-center p-0 sm:p-2 md:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-[#0b0d16] border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[96vh]">
        
        {/* Top Breadcrumb & Title Bar */}
        <div className="bg-[#0e101a] px-3 sm:px-4 py-2 border-b border-white/10 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] sm:text-xs text-gray-400 font-mono hidden md:inline">
              Home / {year} {isTv ? 'Series' : 'Cinema'} /
            </span>
            <h2 className="text-xs sm:text-sm font-black text-white truncate max-w-xs sm:max-w-md">
              {title} {year ? `(${year})` : ''}
            </h2>
            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-red-600 text-white shrink-0">
              {quality}
            </span>
            {item.isDubbedHindi && (
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-400 text-black shrink-0">
                DUAL AUDIO
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Clean Window Button */}
            <button
              onClick={popoutCleanWindow}
              className="px-2.5 py-1 rounded-xl bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-black font-extrabold text-[11px] flex items-center gap-1 border border-amber-400/40 transition cursor-pointer"
              title="Clean Window Popout"
            >
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Clean Window</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-red-600 text-gray-300 hover:text-white transition cursor-pointer"
              aria-label="Close Player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 20 SERVERS TABS (Screenshot v1.hindimovies.to Style: [Server 1] [Server 2] [Server 3]...) */}
        <div className="bg-[#121422] border-b border-white/10 px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          <div className="flex items-center gap-1 text-[11px] font-black text-amber-400 uppercase tracking-wider shrink-0 mr-1">
            <Server className="w-3.5 h-3.5" />
            <span>SERVERS:</span>
          </div>

          {SERVERS_20.map((srv, idx) => {
            const isActive = currentServerIndex === idx;
            return (
              <button
                key={srv.id}
                onClick={() => selectServer(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400 shadow-lg shadow-orange-500/40 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10 hover:text-white'
                }`}
              >
                <span>Server {idx + 1}</span>
              </button>
            );
          })}
        </div>

        {/* PROMINENT FULL HD 3D HIGHLIGHT ATTRACTIVE NEXT SERVER BAR */}
        <div className="bg-gradient-to-r from-[#17192b] via-[#1c1f33] to-[#17192b] border-b border-white/10 px-3 sm:px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-gray-300 font-bold">
              Playing on <strong className="text-white">Server {currentServerIndex + 1}: {currentServer.name}</strong>
            </span>
            <span className="text-[10px] text-gray-500 font-mono hidden md:inline">
              ({currentServer.speed} • {currentServer.quality})
            </span>
          </div>

          {/* FULL HD 3D ATTRACTIVE NEXT SERVER BUTTON */}
          <button
            onClick={cycleNextServer}
            className="w-full sm:w-auto relative group px-6 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:from-red-500 hover:via-orange-400 hover:to-amber-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_6px_0_#9a3412,0_12px_24px_rgba(249,115,22,0.4)] border-t border-yellow-200/50 border-b-4 border-amber-950 active:translate-y-1.5 active:shadow-[0_1px_0_#9a3412] transition-all cursor-pointer transform hover:scale-[1.02]"
            title="Switch to next working server with 1-click and active 100% monetization"
          >
            <Zap className="w-4 h-4 fill-yellow-300 text-yellow-300 animate-bounce" />
            <span>⚡ NEXT SERVER 3D HD (अगला सर्वर {((currentServerIndex + 1) % 20) + 1}/20)</span>
            <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-md font-mono border border-white/20">
              ➔ {SERVERS_20[(currentServerIndex + 1) % 20].name.split(' ')[0]}
            </span>
          </button>
        </div>

        {/* Video Player Main Container with Gestures & Touch Support */}
        <div
          ref={playerContainerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          className={`relative w-full bg-black shadow-2xl overflow-hidden group select-none ${
            isCleanWindowMode || isFullscreen ? 'flex-1 h-full min-h-[70vh]' : 'aspect-video'
          }`}
        >
          {/* Video Container with Dynamic Brightness Filter (Bilibili Style) */}
          <div
            className="w-full h-full relative"
            style={{
              filter: `brightness(${brightness}%)`,
              transition: 'filter 0.05s ease-out',
            }}
          >
            <iframe
              ref={iframeRef}
              key={`${currentServerIndex}-${currentSeason}-${currentEpisode}-${audioTrack}-${quality}-${subtitle}`}
              src={streamUrl}
              title={title}
              className="w-full h-full border-0 absolute inset-0 z-10"
              allowFullScreen
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write; screen-wake-lock"
              sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-fullscreen"
            />
          </div>

          {/* Double-Tap Zones for ±10 Second Skip */}
          <div
            onDoubleClick={() => skipTime(-10)}
            className="absolute top-0 bottom-16 left-0 w-1/4 z-20 cursor-pointer pointer-events-auto"
            title="Double-click to skip back 10 seconds"
          />
          <div
            onDoubleClick={() => skipTime(10)}
            className="absolute top-0 bottom-16 right-0 w-1/4 z-20 cursor-pointer pointer-events-auto"
            title="Double-click to skip forward 10 seconds"
          />

          {/* Animated 10s Seek Ripple Overlay */}
          {seekRipple === 'left' && (
            <div className="absolute top-1/2 left-1/6 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-center justify-center p-4 rounded-full bg-red-600/70 text-white backdrop-blur-md animate-ping">
              <RotateCcw className="w-8 h-8 stroke-[3]" />
              <span className="text-sm font-black">-10s</span>
            </div>
          )}
          {seekRipple === 'right' && (
            <div className="absolute top-1/2 right-1/6 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-center justify-center p-4 rounded-full bg-red-600/70 text-white backdrop-blur-md animate-ping">
              <RotateCw className="w-8 h-8 stroke-[3]" />
              <span className="text-sm font-black">+10s</span>
            </div>
          )}

          {/* Center HUD (Brightness & Volume Indicator) */}
          {hudType && (
            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center justify-center px-6 py-4 rounded-2xl bg-black/85 text-white border border-white/20 backdrop-blur-xl animate-in zoom-in-90 duration-150">
              {hudType === 'brightness' && <Sun className="w-8 h-8 text-amber-400 mb-1" />}
              {hudType === 'volume' && <Volume2 className="w-8 h-8 text-sky-400 mb-1" />}
              {hudType === 'seek' && <RotateCw className="w-8 h-8 text-emerald-400 mb-1" />}
              <span className="text-2xl font-black">{hudValue}</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                {hudType === 'brightness'
                  ? 'Bilibili Brightness'
                  : hudType === 'volume'
                  ? 'MX Player Volume'
                  : 'Skip'}
              </span>
            </div>
          )}

          {/* Floating Toast Message */}
          {toastMessage && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-black/90 text-white border border-white/20 px-4 py-2 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}
        </div>

        {/* BOTTOM CONTROLS BAR (MX Volume, Bilibili Brightness, Dual Audio, Fullscreen) */}
        <div className="bg-[#0f111c] border-t border-white/10 p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2.5 text-xs shrink-0">
          {/* Left: 10s Skip, Brightness & Volume Sliders */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => skipTime(-10)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center gap-1 font-bold cursor-pointer transition"
              title="Skip -10s"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">-10s</span>
            </button>

            <button
              onClick={() => skipTime(10)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center gap-1 font-bold cursor-pointer transition"
              title="Skip +10s"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+10s</span>
            </button>

            {/* Brightness slider */}
            <div className="hidden sm:flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <input
                type="range"
                min="20"
                max="200"
                value={brightness}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setBrightness(val);
                  triggerHud('brightness', `${val}%`);
                }}
                className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
                title="Brightness (Bilibili Style)"
              />
              <span className="text-[10px] text-gray-300 font-bold">{brightness}%</span>
            </div>

            {/* Volume slider */}
            <div className="hidden sm:flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
              <Volume2 className="w-3.5 h-3.5 text-sky-400" />
              <input
                type="range"
                min="0"
                max="200"
                value={volume}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setVolume(val);
                  triggerHud('volume', `${val}%`);
                }}
                className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-sky-400"
                title="Volume (MX Player Style)"
              />
              <span className="text-[10px] text-gray-300 font-bold">{volume}%</span>
            </div>
          </div>

          {/* Right: Audio Selector, Subtitles, 3D Next Server & Fullscreen */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Dual Audio Selector */}
            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-xl border border-white/10">
              <span className="text-[10px] text-amber-400 font-black">AUDIO:</span>
              <select
                value={audioTrack}
                onChange={(e) => {
                  setAudioTrack(e.target.value);
                  showToast(`Language set to ${e.target.value === 'hindi' ? 'Hindi Dubbed' : 'Original Audio'}`);
                }}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="hindi" className="bg-[#10121d] text-white">🇮🇳 Hindi Dubbed</option>
                <option value="english" className="bg-[#10121d] text-white">🌐 English 5.1</option>
                <option value="south" className="bg-[#10121d] text-white">🌴 Tamil / Telugu</option>
              </select>
            </div>

            {/* Subtitles */}
            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-xl border border-white/10">
              <Subtitles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <select
                value={subtitle}
                onChange={(e) => {
                  setSubtitle(e.target.value);
                  showToast(`Subtitles: ${e.target.value.toUpperCase()}`);
                }}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="off" className="bg-[#10121d] text-white">Sub: Off</option>
                <option value="hi" className="bg-[#10121d] text-white">Sub: हिन्दी</option>
                <option value="en" className="bg-[#10121d] text-white">Sub: English</option>
                <option value="auto" className="bg-[#10121d] text-white">Sub: Auto</option>
              </select>
            </div>

            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center gap-1 font-bold cursor-pointer transition"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Fullscreen</span>
            </button>
          </div>
        </div>

        {/* ADSTERRA VIP SPONSOR BANNER BELOW PLAYER (100% Monetization Active) */}
        <div className="px-3 sm:px-4 py-2 bg-[#090b12] border-t border-white/5 flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-400 text-black shadow">
              SPONSORED
            </span>
            <span className="text-gray-300 truncate text-[11px]">
              ⚡ Adsterra Ultra 10Gbps VIP Cinema Node • Ad-Free Fast Cloud
            </span>
          </div>
          <a
            href={getAdsterraUrlByIndex(1)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerAdsterraSmartAd(getAdsterraUrlByIndex(1))}
            className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-black text-[11px] flex items-center gap-1 shrink-0 cursor-pointer shadow"
          >
            <span>VIP Server</span>
            <ExternalLink className="w-3 h-3 stroke-[2.5]" />
          </a>
        </div>
      </div>
    </div>
  );
};
