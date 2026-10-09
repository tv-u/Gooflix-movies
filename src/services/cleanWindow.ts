import { MovieOrShow } from '../types';

/**
 * GOO TV Clean Popup Window Engine
 * Opens playback and download streams in a clean, distraction-free popup window
 * with high speed, zero-sandbox security, and dual-audio support.
 */

export function openCleanPlayWindow(
  media: MovieOrShow,
  season: number = 1,
  episode: number = 1,
  preferredAudio?: string
): Window | null {
  const isTv = media.media_type === 'tv' || (!media.title && !!media.name);
  const isHindiPreferred = preferredAudio === 'hi' || media.isDubbedHindi || media.original_language === 'hi';
  
  // High-speed clean streaming URL with audio routing
  let url = '';
  if (isTv) {
    const audioParam = isHindiPreferred ? '&audio=hi&lang=hi' : '';
    url = `https://multiembed.mov/?video_id=${media.id}&tmdb=1&s=${season}&e=${episode}${audioParam}`;
  } else {
    const audioParam = isHindiPreferred ? '&audio=hi&lang=hi' : '';
    url = `https://multiembed.mov/?video_id=${media.id}&tmdb=1${audioParam}`;
  }

  const screenWidth = typeof window !== 'undefined' ? window.screen.width : 1280;
  const screenHeight = typeof window !== 'undefined' ? window.screen.height : 720;
  const width = Math.min(Math.floor(screenWidth * 0.92), 1360);
  const height = Math.min(Math.floor(screenHeight * 0.88), 780);
  const left = Math.floor((screenWidth - width) / 2);
  const top = Math.floor((screenHeight - height) / 2);

  const windowFeatures = `width=${width},height=${height},top=${top},left=${left},status=no,menubar=no,toolbar=no,location=no,resizable=yes,scrollbars=no`;

  try {
    const popup = window.open(url, `GooTV_Player_${media.id}`, windowFeatures);
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      return window.open(url, '_blank', 'noopener,noreferrer');
    }
    popup.focus();
    return popup;
  } catch {
    return window.open(url, '_blank', 'noopener,noreferrer');
  }
}

export function openCleanDownloadWindow(
  media: MovieOrShow,
  quality: '4k' | '1080p' | '720p' | '480p' = '1080p',
  season: number = 1,
  episode: number = 1
): Window | null {
  const isTv = media.media_type === 'tv' || (!media.title && !!media.name);
  const id = media.id;

  let url = '';
  if (quality === '4k') {
    url = isTv
      ? `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`
      : `https://multiembed.mov/?video_id=${id}&tmdb=1`;
  } else if (quality === '1080p') {
    url = isTv
      ? `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}?server=streamtape`
      : `https://player.autoembed.cc/embed/movie/${id}?server=streamtape`;
  } else if (quality === '720p') {
    url = isTv
      ? `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}?server=streamwish`
      : `https://player.autoembed.cc/embed/movie/${id}?server=streamwish`;
  } else {
    url = isTv
      ? `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}&server=filemoon`
      : `https://multiembed.mov/?video_id=${id}&tmdb=1&server=filemoon`;
  }

  const screenWidth = typeof window !== 'undefined' ? window.screen.width : 1280;
  const screenHeight = typeof window !== 'undefined' ? window.screen.height : 720;
  const width = Math.min(Math.floor(screenWidth * 0.90), 1200);
  const height = Math.min(Math.floor(screenHeight * 0.85), 720);
  const left = Math.floor((screenWidth - width) / 2);
  const top = Math.floor((screenHeight - height) / 2);

  const windowFeatures = `width=${width},height=${height},top=${top},left=${left},status=no,menubar=no,toolbar=no,location=no,resizable=yes,scrollbars=no`;

  try {
    const popup = window.open(url, `GooTV_Download_${media.id}`, windowFeatures);
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      return window.open(url, '_blank', 'noopener,noreferrer');
    }
    popup.focus();
    return popup;
  } catch {
    return window.open(url, '_blank', 'noopener,noreferrer');
  }
}

// Export alias for backward compatibility
export const openCleanPlayerWindow = openCleanPlayWindow;

