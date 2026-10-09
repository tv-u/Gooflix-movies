export interface MovieOrShow {
  id: number;
  title: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type: 'movie' | 'tv';
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count?: number;
  original_language: string;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  origin_country?: string[];
  seasons_count?: number;
  episodes_count?: number;
  isDubbedHindi?: boolean;
  providerName?: string;
  tagline?: string;
  runtime?: number;
  quality?: '4K' | '1080p' | '720p';
  rank?: number;
}

export type CategoryId =
  | 'trending'
  | 'top-100'
  | 'hindi-movies'
  | 'english-movies'
  | 'punjabi-movies'
  | 'south-movies'
  | 'classic-movies'
  | 'hindi-dubbed-movies'
  | 'k-drama'
  | 'hindi-dubbed-kdrama'
  | 'hbo-movies'
  | 'netflix-movies'
  | 'jiohotstar-movies'
  | 'mxplayer-movies'
  // World Cinema categories
  | 'world-cinema'
  | 'japanese-anime'
  | 'spanish-movies'
  | 'french-movies'
  | 'turkish-movies'
  | 'chinese-movies'
  | 'german-movies'
  | 'arabic-movies';

export type SouthSubcategory = 'all' | 'tamil' | 'telugu' | 'malayalam' | 'kannada';

export interface CategoryInfo {
  id: CategoryId;
  label: string;
  icon: string;
  badge: string;
  description: string;
  mediaType: 'movie' | 'tv' | 'both';
  subcategories?: { id: SouthSubcategory; label: string; langCode: string }[];
  isWorldCinema?: boolean;
}

export interface PlayerServer {
  id: string;
  name: string;
  label: string;
  quality: string;
  audioInfo: string;
  speed: string;
  isRecommended?: boolean;
  getUrl: (item: MovieOrShow, season?: number, episode?: number) => string;
}

export interface WatchlistItem {
  item: MovieOrShow;
  addedAt: number;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag?: string;
}
