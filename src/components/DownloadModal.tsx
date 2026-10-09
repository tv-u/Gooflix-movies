import React from 'react';
import { MovieOrShow } from '../types';
import { getDownloadLinks } from '../services/playerServers';
import { X, Download, ExternalLink, HardDrive, Sparkles } from 'lucide-react';

interface DownloadModalProps {
  media: MovieOrShow | null;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ media, onClose }) => {
  if (!media) return null;

  const title = media.title || media.name || 'Movie';
  const links = getDownloadLinks(media);

  const downloadTiers = [
    {
      quality: '4K Ultra HD (Direct Master Stream)',
      badge: '2160p HDR',
      size: media.media_type === 'tv' ? '~1.8 GB / Ep' : '~6.8 GB',
      server: 'Master Direct Cloud Host',
      url: links.link4k,
      color: 'from-amber-500 to-yellow-600',
    },
    {
      quality: '1080p Full HD (StreamTape Pro CDN)',
      badge: '1080p FHD',
      size: media.media_type === 'tv' ? '~650 MB / Ep' : '~2.4 GB',
      server: 'High Speed CDN Mirror 1',
      url: links.link1080p,
      color: 'from-red-600 to-rose-600',
    },
    {
      quality: '720p HD (StreamWish Ultra CDN)',
      badge: '720p HD',
      size: media.media_type === 'tv' ? '~350 MB / Ep' : '~1.2 GB',
      server: 'Fast Mobile CDN Mirror 2',
      url: links.link720p,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      quality: '480p Mobile Data Saver (Filemoon Cloud)',
      badge: '480p SD',
      size: media.media_type === 'tv' ? '~180 MB / Ep' : '~450 MB',
      server: 'Compressed Data Saver',
      url: links.link480p,
      color: 'from-emerald-600 to-teal-600',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#11131c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white truncate max-w-sm sm:max-w-md">
                Download: {title}
              </h3>
              <p className="text-xs text-gray-400">
                Multi-quality direct streaming and download mirrors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <p className="text-xs text-gray-300">
          Select resolution & quality tier for high-speed direct download or offline viewing:
        </p>

        {/* Download Tiers */}
        <div className="space-y-3">
          {downloadTiers.map((tier, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-sm">{tier.quality}</span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white/10 text-amber-400">
                    {tier.badge}
                  </span>
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-2">
                  <HardDrive className="w-3.5 h-3.5 text-gray-500" />
                  <span>Estimated Size: {tier.size}</span>
                  <span>•</span>
                  <span>{tier.server}</span>
                </div>
              </div>

              <a
                href={tier.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-5 py-2.5 rounded-xl bg-gradient-to-r ${tier.color} text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-black/40 hover:opacity-95 transition-all shrink-0 cursor-pointer`}
              >
                <span>Download</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>

        {/* Tip */}
        <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-[11px] text-blue-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Tip: If your browser blocks popups, right-click "Download" and select "Open link in new tab".</span>
        </div>
      </div>
    </div>
  );
};
