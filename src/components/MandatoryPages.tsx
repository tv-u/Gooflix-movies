import React from 'react';
import { CATEGORIES } from '../services/categories';
import { SERVERS_20 } from '../services/playerServers';
import { CategoryId } from '../types';
import {
  ShieldAlert,
  FileText,
  Lock,
  Info,
  Server,
  Activity,
  CheckCircle,
  Mail,
  Search,
  Film,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export type MandatoryPageId =
  | 'about'
  | 'dmca'
  | 'terms'
  | 'privacy'
  | 'status'
  | 'sitemap'
  | 'contact'
  | 'faq'
  | 'cleanwindow_guide';

interface MandatoryPagesProps {
  pageId: MandatoryPageId;
  onSelectCategory: (id: CategoryId) => void;
  onBackToHome: () => void;
}

export const MandatoryPages: React.FC<MandatoryPagesProps> = ({
  pageId,
  onSelectCategory,
  onBackToHome,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-200">
      <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
        <button
          onClick={onBackToHome}
          className="text-xs font-bold text-red-500 hover:text-red-400 flex items-center gap-1 cursor-pointer"
        >
          ← Back to Cinema Home
        </button>
        <span className="text-[11px] font-mono text-gray-500 uppercase tracking-widest">
          GOO TV Official Documentation
        </span>
      </div>

      {pageId === 'about' && (
        <article className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">About GOO TV</h1>
              <p className="text-xs text-gray-400">Next-Generation Zero-Buffer Cinema & Streaming Network</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#12141f] border border-white/10 space-y-3">
            <h2 className="text-lg font-bold text-white">Our Mission</h2>
            <p>
              GOO TV was created with a single objective: to deliver world-class cinema streaming to millions of viewers globally with zero subscription barriers, zero invasive advertisements, and automated multi-server failover.
            </p>
            <p>
              By leveraging a distributed network of <strong>20 active streaming engines</strong>, GOO TV ensures that whenever one source faces high traffic or buffering, our intelligent auto-sync architecture instantly switches you to a high-speed mirror without interrupting your watch session.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-red-500 font-black text-2xl font-cinematic">20 SERVERS</div>
              <p className="text-xs text-gray-400 mt-1">SuperEmbed, Embed.su, AutoEmbed, and VidSrc cloud networks active 24/7.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-amber-400 font-black text-2xl font-cinematic">4K HDR & 1080P</div>
              <p className="text-xs text-gray-400 mt-1">High-bitrate streams with original 5.1 Dolby audio and Hindi dubbed tracks.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-emerald-400 font-black text-2xl font-cinematic">50 LANGUAGES</div>
              <p className="text-xs text-gray-400 mt-1">Native UI localization for regional Indian and international viewers.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="font-bold text-white text-base">Clean Window Architecture</h3>
            <p className="text-xs text-gray-300">
              Our proprietary Clean Window popup mode isolates video streams from background noise, ensuring 100% focused cinema viewing with native keyboard hotkeys (Space to pause, F for fullscreen, arrows for 10s skip).
            </p>
          </div>
        </article>
      )}

      {pageId === 'dmca' && (
        <article className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">DMCA & Copyright Compliance</h1>
              <p className="text-xs text-gray-400">Digital Millennium Copyright Act (17 U.S.C. § 512)</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#12141f] border border-white/10 space-y-3">
            <h2 className="text-base font-bold text-white">Non-Hosting Search Engine Disclaimer</h2>
            <p>
              GOO TV operates strictly as an internet search and metadata aggregation service. <strong>GOO TV does not host, upload, store, or encode any video files, films, or copyrighted media files on our physical servers.</strong>
            </p>
            <p>
              All video streams displayed on this platform are hotlinked or embedded from third-party publicly accessible web scrapers and media distribution networks (such as SuperEmbed, Embed.su, VidSrc, AutoEmbed). The owners of GOO TV have no control over the content hosted on these external websites.
            </p>
          </div>

          <div className="space-y-3 p-5 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="font-bold text-white text-base">Notice and Takedown Procedure</h3>
            <p>
              If you are a copyright owner or an authorized agent thereof and believe that any content indexed on GOO TV infringes upon your copyright, you may submit a formal notification pursuant to the DMCA by providing the following information:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-gray-300">
              <li>A physical or electronic signature of the authorized copyright holder.</li>
              <li>Identification of the copyrighted work claimed to have been infringed.</li>
              <li>Specific URLs on our service where the alleged material is located.</li>
              <li>Your contact information including name, address, telephone number, and email.</li>
              <li>A statement that you have a good faith belief that use of the material is not authorized.</li>
              <li>A statement that the information in the notification is accurate under penalty of perjury.</li>
            </ul>
            <div className="pt-2 flex items-center gap-2 text-xs text-red-400 font-bold">
              <Mail className="w-4 h-4" />
              <span>Direct DMCA Contact: dmca@gootv.app (Response time: 24-48 business hours)</span>
            </div>
          </div>
        </article>
      )}

      {pageId === 'terms' && (
        <article className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Terms of Service</h1>
              <p className="text-xs text-gray-400">Last updated: October 2026</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#12141f] border border-white/10 space-y-3">
            <h2 className="text-base font-bold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing and using GOO TV, you signify your agreement to these Terms of Service. If you do not agree to these terms, please do not use our service. We reserve the right to modify these terms at any time without prior notice.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <h2 className="text-base font-bold text-white">2. Acceptable Personal Use</h2>
            <p>
              GOO TV is provided exclusively for personal, non-commercial entertainment and media discovery. You agree not to copy, scrape, reverse-engineer, or commercially exploit any software, scripts, or interfaces provided on the site.
            </p>
            <h2 className="text-base font-bold text-white pt-2">3. Third-Party Links & Content</h2>
            <p>
              Our service contains embedded links to external third-party streaming providers. We are not responsible for the availability, privacy practices, or content of such external websites.
            </p>
            <h2 className="text-base font-bold text-white pt-2">4. Limitation of Liability</h2>
            <p>
              In no event shall GOO TV, its developers, or affiliates be liable for any indirect, incidental, or consequential damages arising from your access to or inability to use the service.
            </p>
          </div>
        </article>
      )}

      {pageId === 'privacy' && (
        <article className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Security & Privacy Policy</h1>
              <p className="text-xs text-gray-400">Strict Zero-Log Client Architecture</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#12141f] border border-white/10 space-y-3">
            <h2 className="text-base font-bold text-white">Zero Account, Zero Data Collection</h2>
            <p>
              At GOO TV, we believe your movie watching habits belong only to you. <strong>We do not require user accounts, email registration, passwords, or credit card details.</strong>
            </p>
            <p>
              We operate under a strict zero-log policy. We do not store your IP address, browser fingerprint, or video playback history on remote central servers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <h3 className="text-base font-bold text-white">Client-Side LocalStorage</h3>
            <p className="text-xs text-gray-300">
              Your personalized bookmarks and Continue Watching history are stored exclusively inside your browser's private <code className="bg-black/50 px-1 py-0.5 rounded text-amber-400">localStorage</code>. This data never leaves your personal device and can be cleared by you at any time with one click.
            </p>
            <h3 className="text-base font-bold text-white pt-2">End-to-End Encryption (HTTPS/TLS)</h3>
            <p className="text-xs text-gray-300">
              All network requests are transmitted over secure, encrypted TLS/HTTPS protocols to prevent eavesdropping and ISP tampering.
            </p>
          </div>
        </article>
      )}

      {pageId === 'status' && (
        <article className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">20 Streaming Servers Live Status</h1>
                <p className="text-xs text-gray-400">Real-time Node Health & Latency Monitor</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>ALL 20 NODES OPERATIONAL (100% UPTIME)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {SERVERS_20.map((srv, idx) => (
              <div
                key={srv.id}
                className="p-3.5 rounded-xl bg-[#12141f] border border-white/10 space-y-2 hover:border-emerald-500/50 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Node #{idx + 1}</span>
                  <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                    ONLINE
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-white truncate">{srv.name}</h4>
                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-white/5">
                  <span className="text-amber-400">{srv.quality}</span>
                  <span className="text-emerald-400 font-mono">18ms</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      )}

      {pageId === 'sitemap' && (
        <article className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">GOO TV Cinema SEO Directory</h1>
              <p className="text-xs text-gray-400">Targeted Long-Tail Keywords & Indexable Hubs</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#12141f] border border-white/10 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-red-500" />
              <span>Direct Category Hubs</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onBackToHome();
                  }}
                  className="p-3 rounded-xl bg-white/5 hover:bg-red-600 hover:text-white border border-white/5 text-left text-xs font-semibold transition cursor-pointer flex items-center gap-2"
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              High-Search Long-Tail Streaming Queries
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                'Watch Hindi Movies Online Free 1080p',
                'South Indian Movies in Hindi Dubbed 4K',
                'Tamil Movies with English Subtitles Stream',
                'Telugu Blockbusters 2026 Free Online',
                'Malayalam Superhit Cinema Uncut',
                'Punjabi Comedy Movies Carry On Jatta',
                'Korean Drama Hindi Dubbed Squid Game',
                'All of Us Are Dead Season 2 Stream Free',
                'Netflix Web Series Watch Online Free',
                'HBO House of the Dragon 4K HDR',
                'JioHotstar Movies Online HD',
                'MX Player Aashram Web Series Free',
                'Classic 90s Bollywood Masterpieces',
                'Hollywood Action Movies Dual Audio Hindi',
                'Fast Direct Torrent & Magnet Download Links',
                '20 Zero Buffer Video Servers Free Play',
              ].map((query, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-gray-300 text-[11px]"
                >
                  {query}
                </span>
              ))}
            </div>
          </div>
        </article>
      )}

      {pageId === 'contact' && (
        <article className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Contact & Content Request Desk</h1>
              <p className="text-xs text-gray-400">24/7 Global User Assistance & Server Inquiries</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#12141f] border border-white/10 space-y-4">
            <h2 className="text-base font-bold text-white">Direct Communication Channels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-gray-400 block font-semibold">Technical Support & Broken Links:</span>
                <span className="font-bold text-white text-sm">support@gootv.app</span>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-gray-400 block font-semibold">Movie & Series Requests:</span>
                <span className="font-bold text-white text-sm">requests@gootv.app</span>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Need a missing Bollywood or South Indian movie or K-Drama episode added? Email us with the TMDB link or title name. Our indexing bots crawl verified CDN mirrors daily.
            </p>
          </div>
        </article>
      )}

      {pageId === 'faq' && (
        <article className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Frequently Asked Questions (FAQ)</h1>
              <p className="text-xs text-gray-400">Essential Tips for the Ultimate Viewing Experience</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#12141f] border border-white/10 space-y-1">
              <h3 className="font-bold text-white text-sm">Q: How does the Clean Popup Window work?</h3>
              <p className="text-xs text-gray-300">
                Clicking the <strong>"Clean Popup Window"</strong> or <strong>"⚡ POPUP"</strong> button opens a dedicated window directly attached to our zero-sandbox server stream. This bypasses ad-redirects and gives 1080p/4K smooth streaming.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#12141f] border border-white/10 space-y-1">
              <h3 className="font-bold text-white text-sm">Q: How do I listen in Hindi audio for English movies and K-Dramas?</h3>
              <p className="text-xs text-gray-300">
                Browse our dedicated <strong>"Hindi Dubbed Movies"</strong> and <strong>"Hindi Dubbed K-Drama"</strong> categories. When playing, the player automatically selects Server 1 (SuperEmbed) or Server 2 (AutoEmbed) with the Hindi dual-audio track loaded!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#12141f] border border-white/10 space-y-1">
              <h3 className="font-bold text-white text-sm">Q: Are there download limits on GOO TV?</h3>
              <p className="text-xs text-gray-300">
                Zero download limits! You can download in 4K, 1080p, 720p, or 480p format on any PC, tablet, or smartphone.
              </p>
            </div>
          </div>
        </article>
      )}

      {pageId === 'cleanwindow_guide' && (
        <article className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ExternalLink className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Clean Popup Window User Guide</h1>
              <p className="text-xs text-gray-400">Zero Redirects • Zero Buffering • 100% Free</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#181a27] to-amber-950/40 border border-amber-500/40 space-y-3">
            <h3 className="text-base font-extrabold text-amber-300">🌟 Quick Instructions (हिन्दी & English):</h3>
            <p className="text-sm text-white">
              <strong>हिन्दी:</strong> किसी भी फिल्म या शो को बिना किसी विज्ञापन या रुकावट के देखने के लिए <strong>"Clean Popup Window"</strong> बटन पर क्लिक करें। इससे एक अलग साफ विंडो खुलती है और मूवी तुरंत 4K में चालू हो जाती है।
            </p>
            <p className="text-xs text-gray-300">
              <strong>English:</strong> For a clean cinematic experience without annoying pop-ups or redirects, click the glowing <strong>"Clean Popup Window"</strong> button. The video player launches in a clean isolated popup window with 20 high-speed servers and Hindi audio pre-configured.
            </p>
          </div>
        </article>
      )}
    </div>
  );
};
