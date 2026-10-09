import React from 'react';
import {
  X,
  ShieldAlert,
  FileText,
  Lock,
  Info,
  HelpCircle,
  Mail,
  Zap,
  CheckCircle2,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export type PolicyType = 'about' | 'terms' | 'privacy' | 'dmca' | 'contact' | 'faq' | 'cleanwindow_guide';

interface PolicyModalProps {
  type: PolicyType | null;
  onClose: () => void;
}

export const POLICIES: Record<
  PolicyType,
  {
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    content: string;
  }
> = {
  about: {
    title: 'About GOO TV',
    subtitle: 'World-Class 4K Streaming & Cinema Discovery Engine',
    icon: Info,
    content: `
      <div class="space-y-4 text-sm leading-relaxed text-gray-300">
        <p><strong>GOO TV</strong> is an ultra-fast, world-class media streaming and cinema discovery platform engineered for movie enthusiasts worldwide. We connect you directly with <strong>20 active high-speed streaming engines</strong>, ensuring 100% uptime, zero buffering, and crystal-clear 4K HDR playback.</p>
        <div class="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <h4 class="font-bold text-white text-base">Key Network Advantages:</h4>
          <ul class="list-disc list-inside space-y-1 text-gray-300 text-xs">
            <li><strong>20 Zero-Sandbox Streaming Servers:</strong> Automatic failover across SuperEmbed, AutoEmbed, Embed.su, VidSrc, RiveStream, and more.</li>
            <li><strong>Real Clean Popup Window System:</strong> Watch movies without redirects, intrusive popups, or bandwidth throttling.</li>
            <li><strong>Dedicated Hindi Dubbed Cinema:</strong> Authentic Hindi audio track detection for Hollywood blockbusters, South cinema, and K-Dramas.</li>
            <li><strong>50 International & Indian Regional Languages:</strong> Instant UI localization in Hindi, Punjabi, Tamil, Telugu, Malayalam, Kannada, Bengali, and global languages.</li>
            <li><strong>Multi-Quality Direct Downloads:</strong> Download any movie or TV episode in 4K UHD, 1080p BluRay, 720p WebRip, or 480p mobile data-saver format.</li>
          </ul>
        </div>
        <p>All cinema metadata, posters, backdrops, and cast profiles are synchronized in real-time with the TMDB global catalog.</p>
      </div>
    `,
  },
  terms: {
    title: 'Terms of Service',
    subtitle: 'Platform Usage Agreement & Disclaimer',
    icon: FileText,
    content: `
      <div class="space-y-4 text-sm leading-relaxed text-gray-300">
        <p>By accessing or browsing <strong>GOO TV</strong>, you explicitly accept and agree to abide by these Terms of Service.</p>
        <h4 class="font-bold text-white text-base">1. Informational Indexing Role</h4>
        <p>GOO TV functions exclusively as an automated indexing search directory. We do not host, store, stream, upload, or encode any media files on our own servers. All video streams originate from public third-party media nodes that are beyond our control.</p>
        <h4 class="font-bold text-white text-base">2. Personal & Non-Commercial Use</h4>
        <p>Users may access GOO TV strictly for individual, personal, and non-commercial streaming preview purposes. Any commercial redistribution or unauthorized resale is strictly prohibited.</p>
        <h4 class="font-bold text-white text-base">3. Service Availability</h4>
        <p>While our 20 failover servers maintain 99.9% uptime, GOO TV does not guarantee permanent availability of any individual external stream.</p>
      </div>
    `,
  },
  privacy: {
    title: 'Privacy & Data Protection',
    subtitle: 'Zero-Log Policy & Complete User Anonymity',
    icon: Lock,
    content: `
      <div class="space-y-4 text-sm leading-relaxed text-gray-300">
        <p>GOO TV operates under an unwavering <strong>Strict Zero-Log Security Architecture</strong>. We believe in total user privacy and digital autonomy.</p>
        <div class="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <h4 class="font-bold text-white text-base">Our Privacy Guarantees:</h4>
          <ul class="list-disc list-inside space-y-1 text-gray-300 text-xs">
            <li><strong>No Account Required:</strong> You never need to submit your email, name, phone number, or payment details.</li>
            <li><strong>No Tracking Cookies:</strong> We do not track your browsing activity across websites or sell telemetry data to third parties.</li>
            <li><strong>Local Storage Only:</strong> Your Watchlist, Continue Watching history, and language preferences remain encrypted solely on your local device.</li>
            <li><strong>End-to-End HTTPS:</strong> All communication between your browser and our edge CDN is encrypted with high-grade TLS 1.3 security.</li>
          </ul>
        </div>
      </div>
    `,
  },
  dmca: {
    title: 'DMCA & Copyright Compliance',
    subtitle: 'Digital Millennium Copyright Act Compliance Policy',
    icon: ShieldAlert,
    content: `
      <div class="space-y-4 text-sm leading-relaxed text-gray-300">
        <p>GOO TV respects the intellectual property rights of all copyright creators and complies rigorously with <strong>17 U.S.C. § 512 and the Digital Millennium Copyright Act (DMCA)</strong>.</p>
        <h4 class="font-bold text-white text-base">No Media Hosted on Our Infrastructure</h4>
        <p>GOO TV does not upload, store, or broadcast copyrighted video files. When you stream video through GOO TV, you are connecting directly to external third-party hosts. Because we do not control those external hosts, removal from GOO TV will not delete the file from the internet, but will permanently purge all index references from our site.</p>
        <div class="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs space-y-2">
          <p class="font-bold text-white">How to Submit a Valid DMCA Notice:</p>
          <p>Please send an email to <span class="text-red-400 font-bold">dmca@gootv.app</span> containing the specific URLs, evidence of copyrighted ownership, and your contact information. Our legal agent will review and purge indexed records within <strong>24 to 48 business hours</strong>.</p>
        </div>
      </div>
    `,
  },
  contact: {
    title: 'Contact Us & Content Requests',
    subtitle: 'Get in Touch with the GOO TV Engineering Team',
    icon: Mail,
    content: `
      <div class="space-y-4 text-sm leading-relaxed text-gray-300">
        <p>Have questions, server feedback, or want to request a movie or web series to be added? Reach out directly to our 24/7 support desk.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div class="p-3 rounded-xl bg-white/5 border border-white/10">
            <span class="text-gray-400 block mb-1">General Inquiries:</span>
            <span class="font-bold text-white text-sm">support@gootv.app</span>
          </div>
          <div class="p-3 rounded-xl bg-white/5 border border-white/10">
            <span class="text-gray-400 block mb-1">Server Integration:</span>
            <span class="font-bold text-white text-sm">servers@gootv.app</span>
          </div>
        </div>
        <p class="text-xs text-gray-400">Response time is typically under 6 hours. For instant DMCA requests, please tag your subject line with [DMCA URGENT].</p>
      </div>
    `,
  },
  faq: {
    title: 'Frequently Asked Questions (FAQ)',
    subtitle: 'Everything You Need to Know About GOO TV',
    icon: HelpCircle,
    content: `
      <div class="space-y-3 text-xs sm:text-sm text-gray-300">
        <div class="p-3 rounded-xl bg-white/5 border border-white/10">
          <h4 class="font-bold text-white mb-1">Q: How do I use the Clean Popup Window?</h4>
          <p class="text-xs text-gray-300">Simply click the <strong>"Clean Popup Window"</strong> or <strong>"⚡ POPUP"</strong> button on any movie card or hero banner. This opens a separate optimized browser window with zero redirects and instant 4K playback.</p>
        </div>
        <div class="p-3 rounded-xl bg-white/5 border border-white/10">
          <h4 class="font-bold text-white mb-1">Q: How do I switch to Hindi audio?</h4>
          <p class="text-xs text-gray-300">Select any title under the <strong>"Hindi Dubbed Movies"</strong> or <strong>"Hindi Dubbed K-Drama"</strong> categories, or click the <strong>🇮🇳 Hindi Audio</strong> button in the cinema player controls to switch to the SuperEmbed Hindi or AutoEmbed Hindi stream.</p>
        </div>
        <div class="p-3 rounded-xl bg-white/5 border border-white/10">
          <h4 class="font-bold text-white mb-1">Q: Is GOO TV 100% free?</h4>
          <p class="text-xs text-gray-300">Yes! GOO TV requires zero subscription fees, no credit cards, and no user registration. All 20 streaming engines are completely free to enjoy.</p>
        </div>
        <div class="p-3 rounded-xl bg-white/5 border border-white/10">
          <h4 class="font-bold text-white mb-1">Q: Can I download movies for offline watching?</h4>
          <p class="text-xs text-gray-300">Yes! Click the <strong>"Download"</strong> button in the movie details modal or player to access 4K, 1080p, 720p, and 480p direct cloud mirrors.</p>
        </div>
      </div>
    `,
  },
  cleanwindow_guide: {
    title: 'Clean Popup Window User Guide',
    subtitle: 'How to Enjoy Zero-Ads, Fast 4K Cinema Streaming',
    icon: Zap,
    content: `
      <div class="space-y-4 text-sm leading-relaxed text-gray-300">
        <div class="p-4 rounded-2xl bg-gradient-to-r from-red-950/60 to-amber-950/60 border border-amber-500/40 text-xs space-y-2">
          <p class="font-bold text-amber-300 text-sm">💡 Simple Guide in Hindi / English:</p>
          <p class="text-white"><strong>हिन्दी:</strong> किसी भी Movie या Web Series को Play या Download करने के लिए "Clean Popup Window" वाले बटन पर क्लिक करें। इससे एक अलग साफ विंडो खुलती है जिसमें बिना किसी विज्ञापन या रुकावट के मूवी तुरंत चालू हो जाती है।</p>
          <p class="text-gray-200"><strong>English:</strong> Click the "Clean Popup Window" button on any poster or movie page to launch our clean popup player with zero redirect ads, 4K resolution, and instant audio sync.</p>
        </div>
        <div class="space-y-2">
          <h4 class="font-bold text-white text-sm">3 Steps to Watch:</h4>
          <ol class="list-decimal list-inside space-y-1.5 text-xs text-gray-300">
            <li>Pick any title from the 12 categories (Hindi, English, South, K-Drama, etc.).</li>
            <li>Click the glowing yellow <strong>"Clean Popup Window"</strong> button.</li>
            <li>If your browser asks to allow popups, click <strong>"Always Allow Popups from GOO TV"</strong> for smooth one-click playback!</li>
          </ol>
        </div>
      </div>
    `,
  },
};

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const policy = POLICIES[type] || POLICIES.about;
  const Icon = policy.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#11131c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-red-600/30 to-amber-500/30 text-red-400 border border-red-500/40 shadow-lg">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white">{policy.title}</h3>
              <p className="text-xs text-gray-400">{policy.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div
          className="max-h-[65vh] overflow-y-auto pr-1 text-gray-300 space-y-3"
          dangerouslySetInnerHTML={{ __html: policy.content }}
        />

        {/* Bottom Bar */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
          <span>GOO TV Verified Security • 20 Servers Online</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition cursor-pointer shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
