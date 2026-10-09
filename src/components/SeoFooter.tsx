import React from 'react';
import { CATEGORIES } from '../services/categories';
import { CategoryId } from '../types';
import { PolicyType } from './PolicyModal';
import { ShieldCheck, Share2, Globe, Server, Film, Zap, HelpCircle, Mail, BookOpen } from 'lucide-react';

interface SeoFooterProps {
  onSelectCategory: (id: CategoryId) => void;
  onOpenPolicy: (type: PolicyType) => void;
  onOpenLangModal: () => void;
  onOpenServersModal: () => void;
  onOpenShare?: () => void;
}

export const SeoFooter: React.FC<SeoFooterProps> = ({
  onSelectCategory,
  onOpenPolicy,
  onOpenLangModal,
  onOpenServersModal,
  onOpenShare,
}) => {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#0d0e15] py-12 text-xs text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-amber-500 p-0.5 shadow-md shadow-red-600/30">
              <div className="w-full h-full bg-[#0d0e15] rounded-[9px] flex items-center justify-center font-black text-red-500 text-sm">
                GOO
              </div>
            </div>
            <div>
              <span className="font-black text-2xl text-white font-cinematic tracking-tight">
                GOO <span className="text-red-600">TV</span>
              </span>
              <span className="text-gray-500 text-xs ml-2 hidden sm:inline">• World-Class 4K Cinema Network</span>
            </div>
          </div>

          {/* Mandatory Legal & Informational Pages */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 text-xs font-semibold">
            <button
              onClick={() => onOpenPolicy('about')}
              className="hover:text-white transition cursor-pointer"
            >
              About Us
            </button>
            <button
              onClick={() => onOpenPolicy('cleanwindow_guide')}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 transition cursor-pointer font-bold"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>Clean Window Guide</span>
            </button>
            <button
              onClick={() => onOpenPolicy('terms')}
              className="hover:text-white transition cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => onOpenPolicy('privacy')}
              className="hover:text-white transition cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onOpenPolicy('dmca')}
              className="hover:text-white transition cursor-pointer"
            >
              DMCA Disclaimer
            </button>
            <button
              onClick={() => onOpenPolicy('faq')}
              className="hover:text-white transition cursor-pointer flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FAQ</span>
            </button>
            <button
              onClick={() => onOpenPolicy('contact')}
              className="hover:text-white transition cursor-pointer flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Us</span>
            </button>
            {onOpenShare && (
              <button
                onClick={onOpenShare}
                className="hover:text-red-400 text-gray-300 flex items-center gap-1 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Site</span>
              </button>
            )}
          </div>
        </div>

        {/* 12 Categories Quick Links */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Film className="w-4 h-4 text-red-500" />
              <span>12 Verified Cinema Categories (Real TMDB Metadata)</span>
            </h4>
            <button
              onClick={onOpenLangModal}
              className="text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer font-semibold"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>50 Languages Selector</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className="px-2.5 py-1 rounded-lg bg-[#141622] hover:bg-red-600 hover:text-white border border-white/5 transition text-gray-300 text-[11px] cursor-pointer flex items-center gap-1"
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 20 Servers & Safeguard Notice */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-400 border-t border-white/5 pt-4">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero-Sandbox Safe: Active Pop-up Blocking & Cross-Domain Isolation</span>
          </div>

          <button
            onClick={onOpenServersModal}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold transition cursor-pointer"
          >
            <Server className="w-3.5 h-3.5" />
            <span>20 High-Speed Servers Active (View Health Status)</span>
          </button>
        </div>

        {/* SEO Long-Tail & Zero-Competition Indexing Cloud */}
        <div className="p-4 rounded-2xl bg-[#090a10] border border-white/5 text-[10px] text-gray-500 leading-relaxed space-y-2">
          <span className="font-bold text-gray-400 uppercase tracking-wider block">
            Popular Streaming Keywords & Cinema Index:
          </span>
          <p className="line-clamp-3">
            Watch Hindi Movies 2026 Online Free • Latest Bollywood Blockbusters 4K HDR • Hindi Dubbed K-Drama All Episodes Free • Squid Game Season 2 Hindi Audio • Korean Drama Dual Audio English Subtitles • South Indian Hindi Dubbed Movies 2026 Tamil Telugu Malayalam Kannada • English Hollywood Movies 1080p BluRay • Classic Cinema 1970s 1980s 1990s Remastered • HBO Max Movies Stream • Netflix Original Movies Free Embed • JioHotstar Web Series Direct Mirror • MX Player Free Hindi Movies • Clean Popup Window Movie Stream • High Speed Zero Buffering 20 Streaming Servers • GOO TV Free Cinema Network.
          </p>
        </div>

        {/* Legal Disclaimer */}
        <div className="text-[11px] text-gray-500 leading-relaxed space-y-1">
          <p>
            <strong>Disclaimer:</strong> GOO TV operates as an informational content directory. We do not host, broadcast, or store video media on our servers. All embeds reference external public third-party video hosts.
          </p>
          <p>© {new Date().getFullYear()} GOO TV. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};
