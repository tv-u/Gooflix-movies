import { MovieOrShow } from '../types';

export interface PlayerServerDef {
  id: string;
  name: string;
  quality: string;
  audioInfo: string;
  speed: string;
  isRecommended?: boolean;
  getMovie: (id: number, audioLang?: string) => string;
  getTv: (id: number, season: number, episode: number, audioLang?: string) => string;
}

// Exactly from tv-u/Goo-tv/standalone.html: all 20 zero-sandbox streaming servers with Real Audio Track parameters
export const SERVERS_20: PlayerServerDef[] = [
  {
    id: 'superembed',
    name: 'SuperEmbed Ultra (4K)',
    quality: '4K Ultra HD',
    audioInfo: 'Hindi / Multi-Audio',
    speed: 'Instant CDN',
    isRecommended: true,
    getMovie: (id, audioLang = '') => {
      const audioParam = audioLang === 'hi' ? '&audio=hi&lang=hi' : '';
      return `https://multiembed.mov/?video_id=${id}&tmdb=1${audioParam}`;
    },
    getTv: (id, s, e, audioLang = '') => {
      const audioParam = audioLang === 'hi' ? '&audio=hi&lang=hi' : '';
      return `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}${audioParam}`;
    },
  },
  {
    id: 'autoembed',
    name: 'AutoEmbed CC (Smart)',
    quality: '1080p Full HD',
    audioInfo: 'Multi-Track Subtitles',
    speed: 'Ultra Fast',
    isRecommended: true,
    getMovie: (id, audioLang = '') => {
      const audioParam = audioLang === 'hi' ? '?audio=hindi' : '';
      return `https://player.autoembed.cc/embed/movie/${id}${audioParam}`;
    },
    getTv: (id, s, e, audioLang = '') => {
      const audioParam = audioLang === 'hi' ? '?audio=hindi' : '';
      return `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}${audioParam}`;
    },
  },
  {
    id: 'embedsu',
    name: 'Embed.su (VIP CDN)',
    quality: '4K / 1080p HDR',
    audioInfo: 'Original 5.1 Surround',
    speed: 'Global Cloud',
    isRecommended: true,
    getMovie: (id) => `https://embed.su/embed/movie/${id}`,
    getTv: (id, s, e) => `https://embed.su/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: 'vidsrcnet',
    name: 'VidSrc Net (Unblocked)',
    quality: '1080p FHD',
    audioInfo: 'English / Hindi',
    speed: 'Very Fast',
    getMovie: (id) => `https://vidsrc.net/embed/movie/${id}`,
    getTv: (id, s, e) => `https://vidsrc.net/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: 'smashystream',
    name: 'SmashyStream (Multi)',
    quality: '1080p HD',
    audioInfo: 'Dual Audio',
    speed: 'Fast CDN',
    getMovie: (id) => `https://player.smashystream.com/awesomee.php?tmdb=${id}`,
    getTv: (id, s, e) => `https://player.smashystream.com/awesomee.php?tmdb=${id}&season=${s}&episode=${e}`,
  },
  {
    id: '2embed',
    name: '2Embed Global',
    quality: '1080p / 720p',
    audioInfo: 'Multi-Language',
    speed: 'Reliable',
    getMovie: (id) => `https://www.2embed.cc/embed/${id}`,
    getTv: (id, s, e) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`,
  },
  {
    id: 'vidsrcxyz',
    name: 'VidSrc XYZ',
    quality: '1080p HD',
    audioInfo: 'Dual Audio',
    speed: 'Fast',
    getMovie: (id) => `https://vidsrc.xyz/embed/movie?tmdb=${id}`,
    getTv: (id, s, e) => `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
  },
  {
    id: 'moviesapi',
    name: 'MoviesAPI Club',
    quality: '1080p',
    audioInfo: 'Multi-Audio',
    speed: 'High Speed',
    getMovie: (id) => `https://moviesapi.club/movie/${id}`,
    getTv: (id, s, e) => `https://moviesapi.club/tv/${id}-${s}-${e}`,
  },
  {
    id: 'rivestream',
    name: 'RiveStream VIP',
    quality: '1080p Ultra',
    audioInfo: 'Hindi Dubbed',
    speed: 'Super Fast',
    getMovie: (id) => `https://rivestream.live/embed?type=movie&id=${id}`,
    getTv: (id, s, e) => `https://rivestream.live/embed?type=tv&id=${id}&season=${s}&episode=${e}`,
  },
  {
    id: 'vidfast',
    name: 'VidFast Pro',
    quality: '1080p HD',
    audioInfo: 'English / Hindi',
    speed: 'Fast CDN',
    getMovie: (id) => `https://vidfast.pro/movie/${id}`,
    getTv: (id, s, e) => `https://vidfast.pro/tv/${id}/${s}/${e}`,
  },
  {
    id: 'filemoon',
    name: 'Filemoon Cloud',
    quality: '720p / 1080p',
    audioInfo: 'Dual Audio Track',
    speed: 'Cloud Mirror',
    getMovie: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1&server=filemoon`,
    getTv: (id, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}&server=filemoon`,
  },
  {
    id: 'streamwish',
    name: 'StreamWish Ultra',
    quality: '1080p HD',
    audioInfo: 'Multi Subtitles',
    speed: 'High Bandwidth',
    getMovie: (id) => `https://player.autoembed.cc/embed/movie/${id}?server=streamwish`,
    getTv: (id, s, e) => `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}?server=streamwish`,
  },
  {
    id: 'doodstream',
    name: 'DoodStream Host',
    quality: '720p HD',
    audioInfo: 'Dual Audio',
    speed: 'Stable',
    getMovie: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1&server=doodstream`,
    getTv: (id, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}&server=doodstream`,
  },
  {
    id: 'streamtape',
    name: 'StreamTape Pro',
    quality: '1080p FHD',
    audioInfo: 'English / Hindi Sub',
    speed: 'Fast Global',
    getMovie: (id) => `https://player.autoembed.cc/embed/movie/${id}?server=streamtape`,
    getTv: (id, s, e) => `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}?server=streamtape`,
  },
  {
    id: 'upstream',
    name: 'Upstream.to Mirror',
    quality: '1080p HD',
    audioInfo: 'Multi-Track',
    speed: 'Mirror 1',
    getMovie: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1&server=upstream`,
    getTv: (id, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}&server=upstream`,
  },
  {
    id: 'voe',
    name: 'Voe.sx Enterprise',
    quality: '1080p Full HD',
    audioInfo: 'European CDN',
    speed: 'Dedicated Node',
    getMovie: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1&server=voe`,
    getTv: (id, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}&server=voe`,
  },
  {
    id: 'vidguard',
    name: 'Vidguard Shield',
    quality: '1080p HD',
    audioInfo: 'Protected Stream',
    speed: 'Shielded Node',
    getMovie: (id) => `https://player.autoembed.cc/embed/movie/${id}?server=vidguard`,
    getTv: (id, s, e) => `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}?server=vidguard`,
  },
  {
    id: 'vidsrcpm',
    name: 'VidSrc PM Direct',
    quality: '1080p FHD',
    audioInfo: 'Direct Master',
    speed: 'Ultra Fast',
    getMovie: (id) => `https://vidsrc.pm/embed/movie/${id}`,
    getTv: (id, s, e) => `https://vidsrc.pm/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: 'vidlink',
    name: 'VidLink Pro',
    quality: '1080p FHD',
    audioInfo: 'Auto Subtitles',
    speed: 'Clean Stream',
    getMovie: (id) => `https://vidlink.pro/movie/${id}`,
    getTv: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}`,
  },
  {
    id: 'nonito',
    name: 'Noni.to Direct',
    quality: '1080p HD',
    audioInfo: 'Dual Audio',
    speed: 'Direct Node',
    getMovie: (id) => `https://moviesapi.club/movie/${id}`,
    getTv: (id, s, e) => `https://moviesapi.club/tv/${id}-${s}-${e}`,
  },
];

export interface StandaloneDownloadLinks {
  link4k: string;
  link1080p: string;
  link720p: string;
  link480p: string;
}

export function getDownloadLinks(media: MovieOrShow): StandaloneDownloadLinks {
  const isTv = media.media_type === 'tv' || (!media.title && !!media.name);
  const id = media.id;
  return {
    link4k: isTv
      ? `https://multiembed.mov/?video_id=${id}&tmdb=1&s=1&e=1`
      : `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    link1080p: isTv
      ? `https://player.autoembed.cc/embed/tv/${id}/1/1?server=streamtape`
      : `https://player.autoembed.cc/embed/movie/${id}?server=streamtape`,
    link720p: isTv
      ? `https://player.autoembed.cc/embed/tv/${id}/1/1?server=streamwish`
      : `https://player.autoembed.cc/embed/movie/${id}?server=streamwish`,
    link480p: isTv
      ? `https://multiembed.mov/?video_id=${id}&tmdb=1&s=1&e=1&server=filemoon`
      : `https://multiembed.mov/?video_id=${id}&tmdb=1&server=filemoon`,
  };
}
