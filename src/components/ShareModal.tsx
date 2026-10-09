import React, { useState } from 'react';
import { MovieOrShow } from '../types';
import {
  X,
  Share2,
  Copy,
  Check,
  Send,
  MessageCircle,
  ExternalLink,
  Mail,
  Smartphone,
  Globe,
  Sparkles
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  media?: MovieOrShow | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, media }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const title = media ? media.title || media.name || 'Movie' : 'GOO TV Cinema Network';
  const url = typeof window !== 'undefined' ? window.location.href : 'https://gootv.app';
  const shareText = `🍿 Watch "${title}" in 4K HDR for free on GOO TV with zero buffering! Multi-audio & fast stream:`;

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${shareText} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const nativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Stream ${title} on GOO TV`,
        text: shareText,
        url,
      }).catch(() => {});
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: '💬',
      color: 'bg-emerald-600 hover:bg-emerald-500',
      action: () => {
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${url}`)}`,
          '_blank'
        );
      },
    },
    {
      name: 'Telegram',
      icon: '✈️',
      color: 'bg-sky-600 hover:bg-sky-500',
      action: () => {
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`,
          '_blank'
        );
      },
    },
    {
      name: 'Twitter / X',
      icon: '🐦',
      color: 'bg-neutral-800 hover:bg-neutral-700',
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
          '_blank'
        );
      },
    },
    {
      name: 'Facebook',
      icon: '📘',
      color: 'bg-blue-600 hover:bg-blue-500',
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank'
        );
      },
    },
    {
      name: 'Reddit',
      icon: '🤖',
      color: 'bg-orange-600 hover:bg-orange-500',
      action: () => {
        window.open(
          `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(`Stream ${title} on GOO TV in 4K`)}`,
          '_blank'
        );
      },
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      color: 'bg-blue-700 hover:bg-blue-600',
      action: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          '_blank'
        );
      },
    },
    {
      name: 'Pinterest',
      icon: '📌',
      color: 'bg-red-700 hover:bg-red-600',
      action: () => {
        const poster = media?.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : '';
        window.open(
          `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(poster)}&description=${encodeURIComponent(shareText)}`,
          '_blank'
        );
      },
    },
    {
      name: 'SMS / Text',
      icon: '📱',
      color: 'bg-teal-600 hover:bg-teal-500',
      action: () => {
        window.open(
          `sms:?&body=${encodeURIComponent(`${shareText} ${url}`)}`,
          '_blank'
        );
      },
    },
    {
      name: 'Email',
      icon: '✉️',
      color: 'bg-purple-600 hover:bg-purple-500',
      action: () => {
        window.open(
          `mailto:?subject=${encodeURIComponent(`Stream ${title} Free on GOO TV`)}&body=${encodeURIComponent(`${shareText}\n${url}`)}`,
          '_blank'
        );
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#11131c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">Share with Friends & Family</h3>
              <p className="text-xs text-gray-400">Direct instant links with multi-audio 4K streaming</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Preview if provided */}
        {media && (
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
            <div className="w-12 h-16 rounded-lg bg-black overflow-hidden shrink-0">
              <img
                src={media.poster_path ? `https://image.tmdb.org/t/p/w200${media.poster_path}` : ''}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate">{title}</h4>
              <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                {media.overview || 'Streaming free in 4K on GOO TV with zero buffering'}
              </p>
            </div>
          </div>
        )}

        {/* Share Channels Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5">
          {shareOptions.map((opt, idx) => (
            <button
              key={idx}
              onClick={opt.action}
              className={`p-3 rounded-2xl text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer ${opt.color}`}
            >
              <span className="text-xl">{opt.icon}</span>
              <span className="truncate w-full text-center">{opt.name}</span>
            </button>
          ))}

          {/* Native Web Share button if supported */}
          {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
            <button
              onClick={nativeShare}
              className="p-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex flex-col items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Share2 className="w-5 h-5" />
              <span>More Apps</span>
            </button>
          )}
        </div>

        {/* Copy Link Input Bar */}
        <div className="pt-2">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
            Or copy direct stream link:
          </label>
          <div className="flex items-center gap-2 bg-[#161826] border border-white/10 rounded-xl p-1.5">
            <input
              type="text"
              readOnly
              value={url}
              className="bg-transparent text-xs text-gray-300 px-2 flex-1 focus:outline-none select-all truncate"
            />
            <button
              onClick={copyToClipboard}
              className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
