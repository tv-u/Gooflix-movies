import React, { useState, useRef } from 'react';
import { MovieOrShow } from '../types';
import { getBackdropUrl, getPosterUrl } from '../services/tmdb';
import { openCleanPlayWindow, openCleanDownloadWindow } from '../services/cleanWindow';
import { getAdsterraUrlByIndex, triggerAdsterraSmartAd } from '../services/adsterra';
import { getDownloadLinks } from '../services/playerServers';
import {
  Play,
  Download,
  X,
  Film,
  Star,
  Calendar,
  Zap,
  Share2,
  ExternalLink,
  Sparkles,
  Volume2,
  Tv,
  CheckCircle2,
  HardDrive,
  Layers,
  Clock,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

interface DetailsModalProps {
  item: MovieOrShow | null;
  onClose: () => void;
  onPlay: (item: MovieOrShow) => void;
  onOpenDownload: (item: MovieOrShow) => void;
  onOpenShare?: (item: MovieOrShow) => void;
}

export const DetailsModal: React.FC<DetailsModalProps> = ({
  item,
  onClose,
  onPlay,
  onOpenDownload,
  onOpenShare,
}) => {
  const [showTrailer, setShowTrailer] = useState<boolean>(false);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const downloadSectionRef = useRef<HTMLDivElement>(null);

  if (!item) return null;

  const title = item.title || item.name || 'Untitled';
  const backdrop = getBackdropUrl(item.backdrop_path, 'original');
  const poster = getPosterUrl(item.poster_path, 'w500');
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const isTv = item.media_type === 'tv' || (!item.title && !!item.name);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : '7.8';

  const downloadLinks = getDownloadLinks(item);

  const handleCleanPopupPlay = (season = 1, episode = 1) => {
    openCleanPlayWindow(item, season, episode, item.isDubbedHindi ? 'hi' : undefined);
  };

  const handleCleanPopupDownload = (quality: '4k' | '1080p' | '720p' | '480p' = '4k', season = 1, episode = 1) => {
    openCleanDownloadWindow(item, quality, season, episode);
  };

  const scrollToDownloads = () => {
    if (downloadSectionRef.current) {
      downloadSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Download tiers matching Screenshot 3 specifications
  const downloadTiers = [
    {
      quality: '480p SD Mobile Data Saver',
      badge: '480p SD',
      size: isTv ? '~180 MB / Ep' : '~450 MB',
      audio: 'Dual Audio (Hindi + English 2.0)',
      codec: 'x264 WebRip',
      color: 'from-emerald-600 to-teal-700',
      actionKey: '480p' as const,
      directUrl: downloadLinks.link480p,
    },
    {
      quality: '720p HD High Definition',
      badge: '720p HD',
      size: isTv ? '~380 MB / Ep' : '~1.2 GB',
      audio: 'Dual Audio (Hindi + English Stereo)',
      codec: 'x264 / HEVC 10-Bit',
      color: 'from-blue-600 to-indigo-700',
      actionKey: '720p' as const,
      directUrl: downloadLinks.link720p,
    },
    {
      quality: '1080p Full HD Cinema Master',
      badge: '1080p FHD',
      size: isTv ? '~750 MB / Ep' : '~2.8 GB',
      audio: 'Dual Audio (Hindi 5.1 Dolby + Eng 5.1)',
      codec: 'x265 HEVC 10-Bit HDR',
      color: 'from-rose-600 to-red-700',
      actionKey: '1080p' as const,
      directUrl: downloadLinks.link1080p,
    },
    {
      quality: '4K Ultra HD 2160p IMAX Direct',
      badge: '4K UHD HDR',
      size: isTv ? '~1.9 GB / Ep' : '~6.5 GB',
      audio: 'Dolby Atmos 7.1 + Hindi Dubbed Master',
      codec: 'True 4K UHD 2160p HDR10+',
      color: 'from-amber-500 to-yellow-600 text-black',
      actionKey: '4k' as const,
      directUrl: downloadLinks.link4k,
    },
  ];

  // TV Episodes Mock / Generator (Seasons 1-2, Episodes 1-8)
  const episodesList = Array.from({ length: 8 }, (_, i) => ({
    episodeNumber: i + 1,
    title: `Episode ${i + 1}: ${item.title || item.name} Part ${i + 1}`,
    duration: '45m',
  }));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0f111a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl my-6 flex flex-col">
        {/* Top Sticky Close Bar */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          {onOpenShare && (
            <button
              onClick={() => onOpenShare(item)}
              className="p-2.5 rounded-full bg-black/70 hover:bg-white/20 text-gray-200 hover:text-white border border-white/15 cursor-pointer backdrop-blur-md transition shadow-lg"
              title="Share Movie Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-black/70 hover:bg-red-600 text-gray-200 hover:text-white border border-white/15 cursor-pointer backdrop-blur-md transition shadow-lg"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Backdrop Banner with Cinema Gradient */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-black shrink-0">
          <img
            src={backdrop}
            alt={title}
            className="w-full h-full object-cover opacity-50 select-none scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-[#0f111a]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f111a] via-transparent to-transparent hidden sm:block" />

          {/* Floating Poster & Main Headings (Screenshot 3 style) */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-20 flex flex-col sm:flex-row items-start sm:items-end gap-4">
            {/* Poster Thumbnail */}
            <div className="hidden sm:block relative w-28 sm:w-36 md:w-40 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl shadow-black shrink-0 bg-black">
              <img src={poster} alt={title} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow">
                4K HDR
              </div>
            </div>

            {/* Title & Metadata */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-600 text-white shadow">
                  {isTv ? 'WEB SERIES' : 'MOVIE'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-black shadow">
                  DUAL AUDIO
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-emerald-400 border border-emerald-400/20">
                  ⚡ 20 Auto-Sync Servers
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-lg">
                {title} {year ? `(${year})` : ''}
              </h1>

              {/* Badges line */}
              <div className="flex items-center gap-3 text-xs text-gray-300 flex-wrap">
                <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{rating} / 10 IMDb</span>
                </span>
                {year && (
                  <span className="flex items-center gap-1 text-gray-300">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{year}</span>
                  </span>
                )}
                <span className="flex items-center gap-1 text-gray-300">
                  <Volume2 className="w-3.5 h-3.5 text-gray-400" />
                  <span>Hindi Dubbed + English</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 20 SERVERS TABS (Screenshot v1.hindimovies.to Style: [Server 1] [Server 2] [Server 3]...) */}
        <div className="bg-[#121422] border-b border-white/10 px-4 py-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>20 SERVERS:</span>
          </span>
          {Array.from({ length: 20 }, (_, idx) => {
            const isActive = selectedSeason === 1 && idx === 0;
            return (
              <button
                key={`srv-${idx}`}
                onClick={() => {
                  triggerAdsterraSmartAd();
                  handleCleanPopupPlay(selectedSeason, selectedEpisode);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                  idx === 0
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400 shadow-md scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10 hover:text-white'
                }`}
              >
                <span>Server {idx + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Action Buttons Bar with 3D NEXT SERVER Button */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* FULL HD 3D HIGHLIGHT ATTRACTIVE NEXT SERVER BUTTON */}
            <button
              onClick={() => {
                triggerAdsterraSmartAd();
                onClose();
                onPlay(item);
              }}
              className="relative group px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:from-red-500 hover:via-orange-400 hover:to-amber-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-[0_6px_0_#9a3412,0_12px_24px_rgba(249,115,22,0.4)] border-t border-yellow-200/50 border-b-4 border-amber-950 active:translate-y-1.5 active:shadow-[0_1px_0_#9a3412] transition-all cursor-pointer transform hover:scale-[1.02]"
              title="Next Server Full HD 3D"
            >
              <Zap className="w-4 h-4 fill-yellow-300 text-yellow-300 animate-bounce" />
              <span>⚡ NEXT SERVER 3D HD (अगला सर्वर)</span>
            </button>

            {/* 1. Clean Window Player Button (Gold / Amber) */}
            <button
              onClick={() => {
                triggerAdsterraSmartAd();
                handleCleanPopupPlay(selectedSeason, selectedEpisode);
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-xl shadow-amber-500/25 transition-all transform active:scale-95"
              title="Launch Clean Popup Window"
            >
              <Play className="w-4 h-4 fill-black stroke-black" />
              <span>Play in Clean Window</span>
            </button>

            {/* 2. Play Movie Modal (Red) */}
            <button
              onClick={() => {
                triggerAdsterraSmartAd();
                onClose();
                onPlay(item);
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-xl shadow-red-600/30 transition-all transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Play (20 Servers)</span>
            </button>

            {/* 3. Trailer Button (Blue) */}
            <button
              onClick={() => setShowTrailer(!showTrailer)}
              className={`px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm cursor-pointer flex items-center gap-2 transition-all border ${
                showTrailer
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border-blue-500/30'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>{showTrailer ? 'Hide Trailer' : 'Watch Trailer'}</span>
            </button>

            {/* 4. Direct Download Jump Button (Emerald Green) */}
            <button
              onClick={scrollToDownloads}
              className="px-4 py-3 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 font-bold text-xs sm:text-sm cursor-pointer flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Links</span>
            </button>

            {/* Adsterra VIP High-Speed Stream Sponsor */}
            <a
              href={getAdsterraUrlByIndex(0)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerAdsterraSmartAd(getAdsterraUrlByIndex(0))}
              className="px-3.5 py-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shrink-0 ml-auto"
              title="Adsterra 10Gbps VIP Server"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>VIP 10Gbps Link</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Social Share Bar (Screenshot v1.hindimovies.to Style) */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">Share:</span>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Watch ${title} Free in 4K HDR: ${window.location.href}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerAdsterraSmartAd()}
              className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 shadow cursor-pointer"
            >
              <span>WhatsApp</span>
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerAdsterraSmartAd()}
              className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1 shadow cursor-pointer"
            >
              <span>Facebook</span>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Watch ${title} in 4K: `)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerAdsterraSmartAd()}
              className="px-3 py-1 rounded-xl bg-black hover:bg-gray-900 border border-white/20 text-white text-[11px] font-bold flex items-center gap-1 shadow cursor-pointer"
            >
              <span>𝕏 Post</span>
            </a>
            <a
              href={`https://reddit.com/submit?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(title)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerAdsterraSmartAd()}
              className="px-3 py-1 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-bold flex items-center gap-1 shadow cursor-pointer"
            >
              <span>Reddit</span>
            </a>
          </div>

          {/* Embedded Trailer Section if Toggled */}
          {showTrailer && (
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
              <iframe
                src={`https://www.youtube.com/embed?q=${encodeURIComponent(
                  `${title} official trailer hindi english`
                )}&autoplay=1`}
                title="Trailer"
                className="w-full h-full border-0"
                allowFullScreen
              />
            </div>
          )}

          {/* Synopsis / Storyline (Italicized style) */}
          <div className="space-y-2 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
              <span>📖 Storyline & Overview</span>
            </h3>
            <p className="text-sm text-gray-200 italic font-serif leading-relaxed">
              "{item.overview || 'No detailed storyline available for this title. Stream high-speed full HD & 4K.'}"
            </p>
          </div>

          {/* TV Show Season & Episodes Selector (if Web Series) */}
          {isTv && (
            <div className="space-y-3 bg-[#131622] border border-white/10 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Tv className="w-4 h-4 text-red-500" />
                  <h3 className="text-sm font-black text-white">Episodes & Seasons</h3>
                </div>
                {/* Season tabs */}
                <div className="flex items-center gap-1.5">
                  {[1, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSeason(s)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                        selectedSeason === s
                          ? 'bg-red-600 text-white shadow'
                          : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      Season {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Episode Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {episodesList.map((ep) => (
                  <div
                    key={ep.episodeNumber}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-red-600/20 text-red-400 font-black flex items-center justify-center shrink-0 text-[11px]">
                        {ep.episodeNumber}
                      </span>
                      <div className="min-w-0 truncate">
                        <span className="font-bold text-white truncate block">{ep.title}</span>
                        <span className="text-[10px] text-gray-400">{ep.duration} • 1080p FHD</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <button
                        onClick={() => handleCleanPopupPlay(selectedSeason, ep.episodeNumber)}
                        className="px-2 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-black font-black text-[10px] transition cursor-pointer"
                        title="Play in Clean Window"
                      >
                        Play
                      </button>
                      <button
                        onClick={() => handleCleanPopupDownload('1080p', selectedSeason, ep.episodeNumber)}
                        className="p-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white transition cursor-pointer"
                        title="Download Episode"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Direct Download Section (Screenshot 3 style) */}
          <div ref={downloadSectionRef} className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    Direct Download Links (Dual Audio & Multi-Quality)
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    High speed direct cloud mirrors • No waiting time • Clean Window direct downloader
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% WORKING
              </span>
            </div>

            {/* Download Tiers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {downloadTiers.map((tier, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between p-4 rounded-2xl bg-[#141724] border border-white/10 hover:border-white/20 transition-all shadow-md group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white text-xs sm:text-sm group-hover:text-amber-400 transition">
                        {tier.quality}
                      </span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white/10 text-amber-300 border border-white/10">
                        {tier.badge}
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-400 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <HardDrive className="w-3.5 h-3.5 text-gray-500" />
                        <span>File Size: <strong className="text-white">{tier.size}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-gray-500" />
                        <span>{tier.audio}</span>
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono">
                        Codec: {tier.codec}
                      </div>
                    </div>
                  </div>

                  {/* Download Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                    {/* Clean Popup Window Direct Download */}
                    <button
                      onClick={() => handleCleanPopupDownload(tier.actionKey, selectedSeason, selectedEpisode)}
                      className={`flex-1 py-2.5 rounded-xl bg-gradient-to-r ${tier.color} font-black text-xs flex items-center justify-center gap-1.5 shadow-lg cursor-pointer transition transform active:scale-95`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download {tier.badge}</span>
                    </button>

                    {/* Direct External Link */}
                    <a
                      href={tier.directUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer"
                      title="Open Direct Cloud Mirror"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications Table */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs">
            <h4 className="font-black text-white flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Movie Specifications & Technical Details</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-gray-300">
              <div>
                <span className="text-[10px] text-gray-500 uppercase block font-bold">Languages</span>
                <span className="font-bold text-white">Dual Audio (Hindi + English)</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block font-bold">Subtitles</span>
                <span className="font-bold text-white">English (CC) & Hindi</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block font-bold">Video Codecs</span>
                <span className="font-bold text-white">H.264 / HEVC 10-Bit</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block font-bold">Audio Channels</span>
                <span className="font-bold text-white">Stereo 2.0 / Dolby 5.1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
