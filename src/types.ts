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

export type CategoryGroup =
  | 'trending'
  | 'industry'
  | 'animation'
  | 'language'
  | 'dubbed'
  | 'ott'
  | 'genre'
  | 'series';

export type CategoryId =
  // 1. Global Trending & Popular Categories
  | 'trending'
  | 'global-box-office'
  | 'global-blockbusters'
  | 'popular-movies'
  | 'trending-tv'
  | 'new-releases'
  | 'upcoming-movies'
  | 'top-100'
  | 'top-rated'
  | 'classic-movies'
  | 'hidden-gems'
  | 'recommended'

  // 2. Movies by Film Industry
  | 'hollywood-movies'
  | 'english-movies'
  | 'bollywood-movies'
  | 'hindi-movies'
  | 'south-movies'
  | 'punjabi-movies'
  | 'korean-movies'
  | 'chinese-movies'
  | 'japanese-movies'
  | 'russian-movies'
  | 'french-movies'
  | 'spanish-movies'
  | 'german-movies'
  | 'italian-movies'
  | 'turkish-movies'
  | 'thai-movies'
  | 'indonesian-movies'
  | 'filipino-movies'
  | 'african-cinema'
  | 'latin-cinema'
  | 'middle-east-cinema'
  | 'world-cinema'

  // 3. Animation, Anime & Family
  | 'animation-movies'
  | 'kids-movies'
  | 'family-movies'
  | 'anime-movies'
  | 'anime-series'
  | 'japanese-anime'
  | 'superhero-movies'
  | 'fantasy-movies'
  | 'scifi-movies'
  | 'classic-animation'
  | 'adult-animation'

  // 4. Movies by Language
  | 'lang-hindi'
  | 'lang-english'
  | 'lang-punjabi'
  | 'lang-tamil'
  | 'lang-telugu'
  | 'lang-malayalam'
  | 'lang-kannada'
  | 'lang-korean'
  | 'lang-chinese'
  | 'lang-japanese'
  | 'lang-russian'
  | 'lang-spanish'
  | 'lang-french'
  | 'lang-german'
  | 'lang-arabic'
  | 'lang-turkish'
  | 'lang-thai'
  | 'lang-indonesian'
  | 'lang-portuguese'

  // 5. Hindi Dubbed & Dubbed Content
  | 'hindi-dubbed-movies'
  | 'hindi-dubbed-hollywood'
  | 'hindi-dubbed-south'
  | 'hindi-dubbed-korean'
  | 'hindi-dubbed-kdrama'
  | 'hindi-dubbed-chinese'
  | 'hindi-dubbed-anime'
  | 'english-dubbed-anime'
  | 'english-dubbed-movies'
  | 'multi-audio-movies'
  | 'subtitled-movies'
  | 'hindi-subtitles'

  // 6. OTT & Streaming Platforms
  | 'netflix-movies'
  | 'netflix-series'
  | 'hbo-movies'
  | 'hbo-series'
  | 'jiohotstar-movies'
  | 'jiohotstar-shows'
  | 'mxplayer-movies'
  | 'prime-video'
  | 'disney-plus'
  | 'apple-tv'
  | 'hulu'
  | 'paramount-plus'
  | 'peacock'
  | 'sonyliv'
  | 'zee5'
  | 'crunchyroll'

  // 7. Genre Categories
  | 'action-movies'
  | 'adventure-movies'
  | 'comedy-movies'
  | 'crime-movies'
  | 'drama-movies'
  | 'horror-movies'
  | 'thriller-movies'
  | 'mystery-movies'
  | 'romance-movies'
  | 'war-movies'
  | 'history-movies'
  | 'documentary-movies'
  | 'music-movies'
  | 'western-movies'
  | 'sports-movies'
  | 'biography-movies'
  | 'disaster-movies'
  | 'martial-arts'

  // 8. TV Shows, Web Series & Dramas
  | 'global-tv'
  | 'web-series'
  | 'k-drama'
  | 'c-drama'
  | 'j-drama'
  | 'turkish-drama'
  | 'russian-series'
  | 'indian-web-series'
  | 'american-tv'
  | 'british-tv'
  | 'mini-series'
  | 'crime-series'
  | 'reality-shows'
  | 'arabic-movies';

export type SouthSubcategory = 'all' | 'tamil' | 'telugu' | 'malayalam' | 'kannada';

export interface CategoryInfo {
  id: CategoryId;
  label: string;
  icon: string;
  badge: string;
  description: string;
  mediaType: 'movie' | 'tv' | 'both';
  group?: CategoryGroup;
  isPrimary?: boolean;
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
  flag: string;
}
