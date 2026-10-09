import React, { useState } from 'react';
import { MovieOrShow } from '../types';
import { getBackdropUrl } from '../services/tmdb';
import { openCleanPlayWindow, openCleanDownloadWindow } from '../services/cleanWindow';
import { getAdsterraUrlByIndex, triggerAdsterraSmartAd } from '../services/adsterra';
import { Play, Download, X, Film, Star, Calendar, Zap, Share2, ExternalLink, Sparkles } from 'lucide-react';

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
  const [showTrailer, setShowTrailer] = useState(false);

  if (!item) return null;

  const backdrop = getBackdropUrl(item.backdrop_path, 'original');
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);

  const handleCleanPopupPlay = () => {
    openCleanPlayWindow(item, 1, 1, item.isDubbedHindi ? 'hi' : undefined);
  };

  const handleCleanPopupDownload = () => {
    openCleanDownloadWindow(item, '4k', 1, 1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#11131c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl my-8">
        {/* Backdrop Banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-black">
          <img
            src={backdrop}
            alt={item.title || item.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11131c] via-[#11131c]/60 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 hover:bg-red-600 text-white border border-white/15 cursor-pointer transition z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Bottom Title & Actions inside banner */}
          <div className="absolute bottom-6 left-6 right-6 z-10 space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
              {item.title || item.name}
            </h2>
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Play full */}
              <button
                onClick={() => {
                  onClose();
                  onPlay(item);
                }}
                className="px-4 sm:px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/40"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play Movie (20 Servers)</span>
              </button>

              {/* Clean Popup Window Button */}
              <button
                onClick={handleCleanPopupPlay}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/30"
                title="Launch Clean Popup Window"
              >
                <Zap className="w-4 h-4 fill-black stroke-black" />
                <span>Clean Popup Window</span>
              </button>

              {/* Download */}
              <button
                onClick={handleCleanPopupDownload}
                className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/30"
                title="Direct 4K Download in Clean Window"
              >
                <Download className="w-4 h-4" />
                <span>Download (4K/1080p)</span>
              </button>

              {/* Adsterra VIP Fast Stream Sponsor */}
              <a
                href={getAdsterraUrlByIndex(0)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerAdsterraSmartAd(getAdsterraUrlByIndex(0))}
                className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/30 transition shrink-0"
                title="Adsterra High-Speed 10Gbps VIP Server"
              >
                <Sparkles className="w-4 h-4 fill-black" />
                <span>VIP 10Gbps Adsterra</span>
                <ExternalLink className="w-3 h-3 stroke-[3]" />
              </a>

              {/* Trailer */}
              <button
                onClick={() => setShowTrailer(!showTrailer)}
                className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5"
              >
                <Film className="w-4 h-4" />
                <span>{showTrailer ? 'Hide Trailer' : 'Trailer'}</span>
              </button>

              {/* Share */}
              {onOpenShare && (
                <button
                  onClick={() => onOpenShare(item)}
                  className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white font-bold text-xs cursor-pointer flex items-center gap-1.5"
                  title="Share Movie Link"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Details & Synopsis */}
        <div className="p-6 space-y-4 text-xs">
          {/* Trailer view */}
          {showTrailer && (
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black mb-4 border border-white/10 shadow-xl">
              <iframe
                src={`https://www.youtube.com/embed?q=${encodeURIComponent(
                  (item.title || item.name || '') + ' official trailer'
                )}&autoplay=1`}
                title="Trailer"
                className="w-full h-full border-0"
                allowFullScreen
              />
            </div>
          )}

          <div className="flex items-center gap-3 text-gray-400 flex-wrap">
            <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/20">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{item.vote_average} / 10</span>
            </span>
            {year && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-500" />
                <span>{year}</span>
              </span>
            )}
            <span className="uppercase text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white font-bold">
              {item.original_language}
            </span>
            {item.isDubbedHindi && (
              <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 font-bold border border-red-500/30">
                🇮🇳 Hindi Audio Track Verified
              </span>
            )}
            <span className="text-emerald-400 font-semibold">20 Streaming Engines Verified</span>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed">{item.overview}</p>
        </div>
      </div>
    </div>
  );
};
