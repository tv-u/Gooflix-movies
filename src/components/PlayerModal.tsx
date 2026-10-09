import React, { useState, useEffect, useRef } from 'react';
import { MovieOrShow } from '../types';
import { SERVERS_20, PlayerServerDef } from '../services/playerServers';
import { getAdsterraUrlByIndex, triggerAdsterraSmartAd } from '../services/adsterra';
import {
  X,
  Maximize2,
  Zap,
  ExternalLink,
  ShieldCheck,
  Download,
  Film,
  Tv,
  Play,
  RotateCcw,
  RotateCw,
  Server,
  Layers,
  Sparkles,
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

  const [currentServerIndex, setCurrentServerIndex] = useState<number>(0);
  const [currentSeason, setCurrentSeason] = useState<number>(1);
  const [currentEpisode, setCurrentEpisode] = useState<number>(1);
  const [audioTrack, setAudioTrack] = useState<string>('hindi');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const playerWrapperRef = useRef<HTMLDivElement>(null);

  const isTv = item.media_type === 'tv' || (!item.title && !!item.name);
  const totalSeasons = item.seasons_count || 1;
  const totalEpisodes = item.episodes_count || 12;

  const currentServer = SERVERS_20[currentServerIndex] || SERVERS_20[0];
  const activeAudioLang = audioTrack === 'hindi' || item.isDubbedHindi ? 'hi' : '';
  const streamUrl = isTv
    ? currentServer.getTv(item.id, currentSeason, currentEpisode, activeAudioLang)
    : currentServer.getMovie(item.id, activeAudioLang);

  // Esc listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAudioTrackChange = (track: string) => {
    setAudioTrack(track);
    if (track === 'hindi') {
      setCurrentServerIndex(0); // SuperEmbed Hindi Dubbed
      showToast('🇮🇳 Switched to Hindi Dubbed / Dual Audio Track');
    } else if (track === 'english') {
      setCurrentServerIndex(2); // Embed.su English Master
      showToast('🌐 Switched to English Original 5.1 Dolby Audio');
    } else {
      setCurrentServerIndex(1); // AutoEmbed Multi-Audio
      showToast('🎧 Switched to Dual Audio Stream');
    }
  };

  const cycleNextServer = () => {
    const nextIdx = (currentServerIndex + 1) % SERVERS_20.length;
    setCurrentServerIndex(nextIdx);
    showToast(`⚡ Stream switched to Server ${nextIdx + 1}: ${SERVERS_20[nextIdx].name}`);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerWrapperRef.current?.requestFullscreen().catch(() => {});
      showToast('⛶ 100% Fullscreen Cinema Activated');
    } else {
      document.exitFullscreen().catch(() => {});
      showToast('Fullscreen Exited');
    }
  };

  const popoutWindow = () => {
    const width = Math.min(window.screen.width * 0.92, 1280);
    const height = Math.min(window.screen.height * 0.88, 720);
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const popup = window.open(
      streamUrl,
      'GooTVCinemaPlayer',
      `width=${width},height=${height},top=${top},left=${left},status=no,menubar=no,toolbar=no,location=no,resizable=yes,scrollbars=no`
    );
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      window.open(streamUrl, '_blank', 'noopener,noreferrer');
    } else {
      popup.focus();
    }
    showToast('🎬 Clean popup player opened!');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-[#0f111a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl my-4 flex flex-col">
        {/* Toast */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-2xl animate-in slide-in-from-top duration-200">
            {toastMessage}
          </div>
        )}

        {/* Player Header */}
        <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#131522]">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="p-2 rounded-xl bg-red-600 text-white font-black flex items-center justify-center shrink-0">
              {isTv ? <Tv className="w-5 h-5" /> : <Film className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-black text-white truncate flex items-center gap-2">
                <span>{item.title || item.name}</span>
                {isTv && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/60 text-red-300 border border-red-700/60">
                    S{currentSeason} : E{currentEpisode}
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5 flex-wrap">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-600 text-white">
                  {isTv ? 'TV SERIES' : 'MOVIE 4K'}
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Zero-Sandbox Safe</span>
                </span>
                <span>•</span>
                <span className="text-amber-400 font-medium">{currentServer.name}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Clean Popup Window Button */}
            <button
              onClick={popoutWindow}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black flex items-center gap-1.5 shadow-md shadow-amber-500/30 transition cursor-pointer"
              title="Open Clean Popup Window (Zero Ads)"
            >
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Clean Popup</span>
            </button>

            {/* Audio Track Selector */}
            <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-xl border border-white/10 text-xs">
              <span className="text-gray-400 hidden sm:inline">Audio:</span>
              <select
                value={audioTrack}
                onChange={(e) => handleAudioTrackChange(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="hindi" className="bg-[#12141f] text-white">🇮🇳 Hindi Dubbed / Dual</option>
                <option value="english" className="bg-[#12141f] text-white">🌐 English Original 5.1</option>
                <option value="multi" className="bg-[#12141f] text-white">🎧 Dual Audio Multi</option>
              </select>
            </div>

            {/* Download */}
            <button
              onClick={() => onOpenDownload(item)}
              className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Native Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-black font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer text-xs"
              title="Toggle 100% Fullscreen Cinema Mode"
            >
              <Maximize2 className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Fullscreen</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Container */}
        <div
          ref={playerWrapperRef}
          className="relative aspect-video w-full bg-black shadow-2xl border-y border-white/10 group overflow-hidden"
        >
          {/* Floating Status Badges */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2 pointer-events-none">
            <span className="bg-red-600/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              LIVE CINEMA
            </span>
            <span className="bg-black/80 backdrop-blur-md text-amber-400 text-[10px] font-black px-2 py-1 rounded-lg border border-amber-400/30">
              {currentServer.quality}
            </span>
            <span className="bg-black/80 backdrop-blur-md text-emerald-400 text-[10px] font-black px-2 py-1 rounded-lg border border-emerald-400/30">
              {audioTrack === 'hindi' ? 'Hindi Dubbed Dual Audio' : audioTrack === 'english' ? 'English Original 5.1' : 'Multi-Audio'}
            </span>
          </div>

          {/* Fullscreen Floating Toggle */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-3 right-3 z-20 p-2 rounded-xl bg-black/75 hover:bg-red-600 text-white transition cursor-pointer backdrop-blur-md shadow"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Iframe */}
          <iframe
            key={`${currentServerIndex}-${currentSeason}-${currentEpisode}`}
            src={streamUrl}
            title={item.title || item.name || 'GOO TV'}
            className="w-full h-full border-0 absolute inset-0 z-10"
            allowFullScreen
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write; screen-wake-lock"
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-fullscreen"
          />

          {/* Quick Floating Controls Bar */}
          <div className="absolute bottom-3 left-3 right-3 z-20 bg-black/85 backdrop-blur-md p-2 rounded-xl border border-white/10 flex items-center justify-between text-xs opacity-90 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-300 font-semibold ml-1">
                Server {currentServerIndex + 1}: {currentServer.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={popoutWindow}
                className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-black cursor-pointer flex items-center gap-1 shadow"
                title="Pop out into clean popup window"
              >
                <ExternalLink className="w-3 h-3 stroke-[2.5]" />
                <span className="hidden sm:inline">Clean Window</span>
              </button>
              <button
                onClick={cycleNextServer}
                className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold cursor-pointer flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Next Server</span>
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white cursor-pointer"
                title="Fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Player Actions */}
        <div className="p-3 sm:p-4 bg-[#12141f] border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-gray-400">
            If stream slows down or buffers, click auto-heal next server:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={cycleNextServer}
              className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-600/30"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Auto-Switch Next Server ({currentServerIndex + 1}/20)</span>
            </button>
            <button
              onClick={popoutWindow}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Clean Popout Window</span>
            </button>
            <a
              href={getAdsterraUrlByIndex(2)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerAdsterraSmartAd(getAdsterraUrlByIndex(2))}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black cursor-pointer flex items-center gap-1 shadow-md shadow-amber-500/20"
              title="Adsterra 10Gbps VIP Cinema Node"
            >
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              <span>10Gbps VIP Link</span>
              <ExternalLink className="w-3 h-3 stroke-[2.5]" />
            </a>
          </div>
        </div>

        {/* 20 Servers Horizontal Scroll Pills */}
        <div className="p-3 sm:p-4 bg-[#0d0e15] border-b border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-red-500" />
              <span>Select Streaming Server (20 Zero-Sandbox CDN Nodes):</span>
            </span>
            <span className="text-[11px] text-gray-400 font-mono">
              Node #{currentServerIndex + 1} Active
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {SERVERS_20.map((srv, idx) => {
              const isSelected = currentServerIndex === idx;
              return (
                <button
                  key={srv.id}
                  onClick={() => {
                    setCurrentServerIndex(idx);
                    showToast(`⚡ Stream synced to ${srv.name}`);
                  }}
                  className={`px-3 py-2 rounded-xl text-left border shrink-0 transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950/60'
                      : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-400'}`} />
                    <span className="text-xs font-bold whitespace-nowrap">{srv.name}</span>
                  </div>
                  <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-gray-200' : 'text-gray-400'}`}>
                    {srv.quality} • {srv.speed}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* TV Series Seasons & Episodes Grid */}
        {isTv && (
          <div className="p-4 bg-[#131522] border-b border-white/10 space-y-3">
            {/* Seasons tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-extrabold text-white uppercase tracking-wider shrink-0 mr-1">
                Seasons:
              </span>
              {Array.from({ length: Math.min(totalSeasons, 10) }, (_, i) => i + 1).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setCurrentSeason(s);
                    setCurrentEpisode(1);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                    currentSeason === s
                      ? 'bg-red-600 text-white border-red-500'
                      : 'bg-white/5 text-gray-300 border-white/5 hover:bg-white/10'
                  }`}
                >
                  Season {s}
                </button>
              ))}
            </div>

            {/* Episodes */}
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-2">
                Episodes for Season {currentSeason}:
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {Array.from({ length: Math.min(totalEpisodes, 24) }, (_, i) => i + 1).map((e) => (
                  <button
                    key={e}
                    onClick={() => {
                      setCurrentEpisode(e);
                      showToast(`Playing Season ${currentSeason} Episode ${e}`);
                    }}
                    className={`p-2 rounded-xl text-center font-bold text-xs transition cursor-pointer border ${
                      currentEpisode === e
                        ? 'bg-amber-500 text-black border-amber-400 shadow-md font-black'
                        : 'bg-white/5 text-gray-300 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    E{e}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
