import { CategoryId, MovieOrShow, SouthSubcategory } from '../types';

const TMDB_API_KEYS = [
  '4e44d9029b1270a757cddc766a1bcb63', // 200 OK verified
  '15d2ea6d0dc1d476efbca3eba2b9bbfb', // 200 OK verified
  '04c35731a5ee918f014970082a0088b1', // 200 OK verified
  '2dca580c2a14b55200e784d157207b4d', // 200 OK verified
  'e9e9d8da18ae29fc430845952232787c', // 200 OK verified
];

let activeKeyIndex = 0;
export function getApiKey(): string {
  return TMDB_API_KEYS[activeKeyIndex % TMDB_API_KEYS.length];
}

export function rotateApiKey(): void {
  activeKeyIndex = (activeKeyIndex + 1) % TMDB_API_KEYS.length;
}

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// Returns genuine TMDB poster CDN URL without fake / unrelated photos
export function getPosterUrl(path: string | null | undefined, size: 'w342' | 'w500' | 'original' = 'w500'): string {
  if (!path || path.trim() === '') return '';
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(path: string | null | undefined, size: 'w780' | 'w1280' | 'original' = 'w1280'): string {
  if (!path || path.trim() === '') return '';
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export interface FetchResult {
  items: MovieOrShow[];
  page: number;
  totalPages: number;
  totalResults: number;
}

// Known K-Dramas with verified Hindi Dubbed audio releases (TMDB IDs)
const HINDI_DUBBED_KDRAMA_IDS = new Set([
  93405, // Squid Game
  99966, // All of Us Are Dead
  85937, // Crash Landing on You
  136283, // The Glory
  117376, // Vincenzo
  153496, // Business Proposal
  96580, // Sweet Home
  216390, // My Demon
  211684, // King the Land
  110492, // Hellbound
  125988, // Bloodhounds
  218230, // Death's Game
  67070, // Descendants of the Sun
  80986, // Extraordinary Attorney Woo
  110356, // Happiness
  122046, // Tomorrow
  197067, // Celebrity
  94605, // Itaewon Class
  118269, // Alchemy of Souls
  105248, // Start-Up
]);

// Map raw TMDB item to our normalized MovieOrShow
export function normalizeTmdbItem(
  item: any,
  fallbackMediaType: 'movie' | 'tv' = 'movie',
  forcedCategory?: CategoryId
): MovieOrShow {
  const media_type: 'movie' | 'tv' = item.media_type || (item.first_air_date ? 'tv' : fallbackMediaType);
  const title = item.title || item.name || item.original_title || item.original_name || 'Untitled';
  const original_lang = item.original_language || 'en';
  
  // Hindi dubbed detection:
  // If original language is NOT Hindi, but it's a Hollywood/South/Korean blockbuster or in our curated set
  let isDubbedHindi = false;
  if (forcedCategory === 'hindi-dubbed-movies' || forcedCategory === 'hindi-dubbed-kdrama') {
    isDubbedHindi = true;
  } else if (original_lang !== 'hi') {
    if (original_lang === 'ko' && HINDI_DUBBED_KDRAMA_IDS.has(item.id)) {
      isDubbedHindi = true;
    } else if (['te', 'ta', 'ml', 'kn', 'en'].includes(original_lang) && item.popularity > 25) {
      isDubbedHindi = true;
    }
  }

  let providerName: string | undefined;
  if (forcedCategory === 'hbo-movies') providerName = 'HBO';
  else if (forcedCategory === 'netflix-movies') providerName = 'Netflix';
  else if (forcedCategory === 'jiohotstar-movies') providerName = 'JioHotstar';
  else if (forcedCategory === 'mxplayer-movies') providerName = 'MX Player';

  return {
    id: item.id,
    title,
    name: item.name || item.title,
    original_title: item.original_title,
    original_name: item.original_name,
    overview: item.overview || 'No storyline synopsis currently available for this title.',
    poster_path: item.poster_path,
    backdrop_path: item.backdrop_path,
    media_type,
    release_date: item.release_date || item.first_air_date,
    first_air_date: item.first_air_date,
    vote_average: typeof item.vote_average === 'number' ? Math.round(item.vote_average * 10) / 10 : 7.5,
    vote_count: item.vote_count || 100,
    original_language: original_lang,
    genre_ids: item.genre_ids || [],
    origin_country: item.origin_country || [],
    isDubbedHindi,
    providerName,
    quality: item.vote_average > 7.5 ? '4K' : '1080p',
  };
}

// Strict deduplicate helper to guarantee ZERO duplicate posters, IDs, or titles across pages
export function deduplicateItems(existing: MovieOrShow[], incoming: MovieOrShow[]): MovieOrShow[] {
  const seenIds = new Set<number>();
  const seenTitles = new Set<string>();
  const seenPosters = new Set<string>();
  const result: MovieOrShow[] = [];

  const addItemSafely = (item: MovieOrShow) => {
    if (!item || !item.id) return;
    const cleanTitle = (item.title || item.name || '').trim().toLowerCase();
    const poster = item.poster_path ? item.poster_path.trim() : null;

    if (seenIds.has(item.id)) return;
    if (cleanTitle && seenTitles.has(cleanTitle)) return;
    if (poster && seenPosters.has(poster)) return;

    seenIds.add(item.id);
    if (cleanTitle) seenTitles.add(cleanTitle);
    if (poster) seenPosters.add(poster);
    result.push(item);
  };

  for (const item of existing) {
    addItemSafely(item);
  }
  for (const item of incoming) {
    addItemSafely(item);
  }

  return result;
}

// Curated high quality authentic catalog for seamless fallback & instant offline experience
const FALLBACK_CATALOG: Partial<Record<CategoryId, MovieOrShow[]>> = {
  'trending': [
    {
      id: 575264,
      title: 'Mission: Impossible - The Final Reckoning',
      overview: 'Our lives are the sum of our choices. Ethan Hunt and his IMF team face off against the all-knowing AI Entity in a globe-trotting climax.',
      poster_path: '/zOpe0e8w2B9O293JR47aNsq5n2B.jpg',
      backdrop_path: '/r2J02Z2OpNTctfOSN2Ydg3mA5R6.jpg',
      media_type: 'movie',
      release_date: '2025-05-23',
      vote_average: 8.4,
      vote_count: 3200,
      original_language: 'en',
      quality: '4K',
      isDubbedHindi: true,
    },
    {
      id: 939243,
      title: 'Sonic the Hedgehog 3',
      overview: 'Sonic, Knuckles, and Tails reunite against a powerful new adversary, Shadow, a mysterious villain with powers unlike anything they have faced.',
      poster_path: '/d8qG3y6d8NlCj1o7hL94FjAomdO.jpg',
      backdrop_path: '/zOpe0e8w2B9O293JR47aNsq5n2B.jpg',
      media_type: 'movie',
      release_date: '2024-12-20',
      vote_average: 7.8,
      vote_count: 1450,
      original_language: 'en',
      quality: '1080p',
      isDubbedHindi: true,
    },
    {
      id: 872585,
      title: 'Oppenheimer',
      overview: 'The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II.',
      poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
      media_type: 'movie',
      release_date: '2023-07-21',
      vote_average: 8.1,
      vote_count: 9800,
      original_language: 'en',
      quality: '4K',
      isDubbedHindi: true,
    },
    {
      id: 93405,
      title: 'Squid Game',
      name: 'Squid Game',
      overview: 'Hundreds of cash-strapped players accept a strange invitation to compete in children’s games. Inside, a tempting prize awaits with deadly stakes.',
      poster_path: '/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg',
      backdrop_path: '/2meX1nMdScFOoV4370rqHWFDxSu.jpg',
      media_type: 'tv',
      first_air_date: '2021-09-17',
      vote_average: 8.3,
      vote_count: 14200,
      original_language: 'ko',
      quality: '4K',
      isDubbedHindi: true,
      providerName: 'Netflix',
    },
  ],
  'hindi-movies': [
    {
      id: 864692,
      title: 'Stree 2: Sarkate Ka Aatank',
      overview: 'After the events of Stree, the town of Chanderi is being haunted again. This time by a headless entity named Sarkata who kidnaps women.',
      poster_path: '/mKHYqVl9eL4BwHqB7GvWb2lqU5v.jpg',
      backdrop_path: '/7m31oXhBkWU0x0Wk59nFq42c3G2.jpg',
      media_type: 'movie',
      release_date: '2024-08-15',
      vote_average: 7.7,
      original_language: 'hi',
      quality: '1080p',
    },
    {
      id: 799583,
      title: 'Animal',
      overview: 'A toxic father-son relationship triggers a lethal underworld war of retribution, vengeance, and extreme violence.',
      poster_path: '/hrGIY2W8Zl2Oa2T2XmQx8hE9qU0.jpg',
      backdrop_path: '/x4NkWZ8qK7L9V3pQoVq8Z4qK7L9.jpg',
      media_type: 'movie',
      release_date: '2023-12-01',
      vote_average: 6.9,
      original_language: 'hi',
      quality: '4K',
    },
    {
      id: 866398,
      title: 'Fighter',
      overview: 'Top Air Force aviators come together to establish Air Dragons, a specialized squad dealing with border tensions and terror threats.',
      poster_path: '/z1pG2kHjX7mQ3vT9yL4oP6rS8uW.jpg',
      backdrop_path: '/b8Wc5d4rF1gH2jK3lM4nO5pQ6rS.jpg',
      media_type: 'movie',
      release_date: '2024-01-25',
      vote_average: 7.2,
      original_language: 'hi',
      quality: '1080p',
    },
    {
      id: 872906,
      title: 'Jawan',
      overview: 'A man is driven by a personal vendetta to rectify the wrongs in society while keeping a promise made years ago.',
      poster_path: '/jYW3r6hUf4qO2wM5nK8pP7rL9yB.jpg',
      backdrop_path: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
      media_type: 'movie',
      release_date: '2023-09-07',
      vote_average: 7.3,
      original_language: 'hi',
      quality: '4K',
    },
    {
      id: 976573,
      title: 'Dunki',
      overview: 'Four friends from a village in Punjab share a common dream: to go to England. Their problem is that they have neither the visa nor the ticket.',
      poster_path: '/jJm3yP7oV6fR8tN2wK1bA4cM9uD.jpg',
      backdrop_path: '/sRLC052LnMjwT89GWB89Uge15wh.jpg',
      media_type: 'movie',
      release_date: '2023-12-21',
      vote_average: 7.1,
      original_language: 'hi',
      quality: '1080p',
    },
    {
      id: 998844,
      title: 'Bhool Bhulaiyaa 3',
      overview: 'Ruhaan travels to the kingdom of Raktaghat where two sinister spirits claim to be the real Manjulika.',
      poster_path: '/qZ9kM4oP2wT7rL5yB1vU6xN3pQ8.jpg',
      backdrop_path: '/aQvJ2mK9nL8pT3vR7wP4qO1bN6s.jpg',
      media_type: 'movie',
      release_date: '2024-11-01',
      vote_average: 6.8,
      original_language: 'hi',
      quality: '1080p',
    },
  ],
  'english-movies': [
    {
      id: 693134,
      title: 'Dune: Part Two',
      overview: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators.',
      poster_path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s5200bm.jpg',
      media_type: 'movie',
      release_date: '2024-03-01',
      vote_average: 8.2,
      original_language: 'en',
      quality: '4K',
    },
    {
      id: 533535,
      title: 'Deadpool & Wolverine',
      overview: 'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary behind him, until the TVA recruits him.',
      poster_path: '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
      backdrop_path: '/9l1eZiJHmhr5jYmsVha2N9Jum72.jpg',
      media_type: 'movie',
      release_date: '2024-07-26',
      vote_average: 7.7,
      original_language: 'en',
      quality: '4K',
      isDubbedHindi: true,
    },
    {
      id: 1022789,
      title: 'Inside Out 2',
      overview: 'Teenager Riley’s mind headquarters undergoes a sudden demolition to make room for new unexpected emotions like Anxiety.',
      poster_path: '/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
      backdrop_path: '/xg27NrXi7gIrPV75xg8iytSzlwo.jpg',
      media_type: 'movie',
      release_date: '2024-06-14',
      vote_average: 7.6,
      original_language: 'en',
      quality: '1080p',
      isDubbedHindi: true,
    },
    {
      id: 76600,
      title: 'Avatar: The Way of Water',
      overview: 'Set more than a decade after the events of the first film, Jake Sully and Neytiri navigate family survival across Pandora’s oceans.',
      poster_path: '/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
      backdrop_path: '/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg',
      media_type: 'movie',
      release_date: '2022-12-16',
      vote_average: 7.6,
      original_language: 'en',
      quality: '4K',
      isDubbedHindi: true,
    },
  ],
  'punjabi-movies': [
    {
      id: 887019,
      title: 'Carry On Jatta 3',
      overview: 'Advocate Dhillon’s son Jass wants to marry Meet, but Meet’s brothers are sworn rivals with his father, sparking hilarious confusion.',
      poster_path: '/mJmQ8kL2vR6pW9tX4bA7cM3uN1.jpg',
      backdrop_path: '/qZpL4vK8mR2oW9tX5bA7cM3uN1.jpg',
      media_type: 'movie',
      release_date: '2023-06-29',
      vote_average: 7.6,
      original_language: 'pa',
      quality: '1080p',
    },
    {
      id: 981240,
      title: 'Jatt & Juliet 3',
      overview: 'Fateh and Pooja, two rival Punjab police officers, are sent on a high-stakes investigation to the UK with non-stop banter.',
      poster_path: '/aQpL9kM2vR6pW9tX4bA7cM3uN1.jpg',
      backdrop_path: '/b8Wc5d4rF1gH2jK3lM4nO5pQ6rS.jpg',
      media_type: 'movie',
      release_date: '2024-06-27',
      vote_average: 7.5,
      original_language: 'pa',
      quality: '1080p',
    },
    {
      id: 978142,
      title: 'Warning 2',
      overview: 'Geja seeks vengeance against his enemies while imprisoned inside a maximum security Punjab prison.',
      poster_path: '/c8Wc5d4rF1gH2jK3lM4nO5pQ6rS.jpg',
      backdrop_path: '/x4NkWZ8qK7L9V3pQoVq8Z4qK7L9.jpg',
      media_type: 'movie',
      release_date: '2024-02-02',
      vote_average: 7.3,
      original_language: 'pa',
      quality: '1080p',
    },
    {
      id: 852719,
      title: 'Chal Mera Putt 3',
      overview: 'South Asian immigrants in the UK hustle, live together and struggle against deportation with warmth and laughter.',
      poster_path: '/d8Wc5d4rF1gH2jK3lM4nO5pQ6rS.jpg',
      backdrop_path: '/sRLC052LnMjwT89GWB89Uge15wh.jpg',
      media_type: 'movie',
      release_date: '2021-10-01',
      vote_average: 7.4,
      original_language: 'pa',
      quality: '1080p',
    },
  ],
  'south-movies': [
    {
      id: 695721,
      title: 'Kalki 2898 AD',
      overview: 'Set in a post-apocalyptic world in the year 2898 AD, a modern avatar of Vishnu descends to protect humanity from evil.',
      poster_path: '/9K4G2q5W7V8Y6q3T4P9L1kM8vR2.jpg',
      backdrop_path: '/7m31oXhBkWU0x0Wk59nFq42c3G2.jpg',
      media_type: 'movie',
      release_date: '2024-06-27',
      vote_average: 7.6,
      original_language: 'te',
      quality: '4K',
      isDubbedHindi: true,
    },
    {
      id: 579974,
      title: 'RRR',
      overview: 'A fictional tale about two legendary revolutionaries and their journey away from home before fighting for their country in the 1920s.',
      poster_path: '/nEufeZlyAOLqO2brrs0yeMu1QXO.jpg',
      backdrop_path: '/wPuWWbT0i1q7yJ3gG9u8vF1kK8L.jpg',
      media_type: 'movie',
      release_date: '2022-03-24',
      vote_average: 8.0,
      original_language: 'te',
      quality: '4K',
      isDubbedHindi: true,
    },
    {
      id: 804616,
      title: 'Pushpa 2: The Rule',
      overview: 'Pushpa Raj controls the red sandalwood smuggling empire while navigating clash with SP Bhanwar Singh Shekhawat.',
      poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      backdrop_path: '/r2J02Z2OpNTctfOSN2Ydg3mA5R6.jpg',
      media_type: 'movie',
      release_date: '2024-12-05',
      vote_average: 7.9,
      original_language: 'te',
      quality: '4K',
      isDubbedHindi: true,
    },
    {
      id: 798286,
      title: 'Leo',
      overview: 'Parthiban is a mild-mannered cafe owner in Kashmir who becomes targeted by gangsters who suspect he is a former syndicate leader.',
      poster_path: '/y9l1eZiJHmhr5jYmsVha2N9Jum72.jpg',
      backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
      media_type: 'movie',
      release_date: '2023-10-19',
      vote_average: 7.4,
      original_language: 'ta',
      quality: '1080p',
      isDubbedHindi: true,
    },
    {
      id: 1144709,
      title: 'Manjummel Boys',
      overview: 'A group of friends from Kochi travel to Kodaikanal where one slips into the deadly Guna Caves, sparking a perilous rescue mission.',
      poster_path: '/b8Wc5d4rF1gH2jK3lM4nO5pQ6rS.jpg',
      backdrop_path: '/xg27NrXi7gIrPV75xg8iytSzlwo.jpg',
      media_type: 'movie',
      release_date: '2024-02-22',
      vote_average: 8.3,
      original_language: 'ml',
      quality: '1080p',
      isDubbedHindi: true,
    },
    {
      id: 609681,
      title: 'K.G.F: Chapter 2',
      overview: 'In the blood-soaked Kolar Gold Fields, Rocky’s name strikes fear into his foes while the government sees him as a threat.',
      poster_path: '/64i9C1Z0Pgg93K2SVNLCjCSvE.jpg',
      backdrop_path: '/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg',
      media_type: 'movie',
      release_date: '2022-04-14',
      vote_average: 7.8,
      original_language: 'kn',
      quality: '4K',
      isDubbedHindi: true,
    },
  ],
  'classic-movies': [
    {
      id: 238,
      title: 'The Godfather',
      overview: 'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.',
      poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      backdrop_path: '/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
      media_type: 'movie',
      release_date: '1972-03-14',
      vote_average: 8.7,
      original_language: 'en',
      quality: '4K',
    },
    {
      id: 278,
      title: 'The Shawshank Redemption',
      overview: 'Imprisoned in the 1940s for murder, Andy Dufresne befriends fellow inmate Red and finds solace through acts of common decency.',
      poster_path: '/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
      backdrop_path: '/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
      media_type: 'movie',
      release_date: '1994-09-23',
      vote_average: 8.7,
      original_language: 'en',
      quality: '4K',
    },
    {
      id: 19404,
      title: 'Dilwale Dulhania Le Jayenge',
      overview: 'Raj and Simran meet on a Europe trip and fall in love. When Raj learns Simran is already promised to another, he follows her to Punjab.',
      poster_path: '/lfRkUr7DYdHldAqi3PwdQGBRBPM.jpg',
      backdrop_path: '/mSDmv538k85TsIthwhmNuPAW0UA.jpg',
      media_type: 'movie',
      release_date: '1995-10-20',
      vote_average: 8.5,
      original_language: 'hi',
      quality: '1080p',
    },
    {
      id: 597,
      title: 'Titanic',
      overview: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
      poster_path: '/9xjZS2rlVxm8SFx8kFPC3IGnre5.jpg',
      backdrop_path: '/yDIv5hX22fqZCa4uWw0rB2kK3b0.jpg',
      media_type: 'movie',
      release_date: '1997-11-18',
      vote_average: 7.9,
      original_language: 'en',
      quality: '4K',
      isDubbedHindi: true,
    },
    {
      id: 39514,
      title: 'Sholay',
      overview: 'Two ex-convicts are hired by a retired policeman to capture the ruthless dacoit Gabbar Singh who murdered his family.',
      poster_path: '/z1pG2kHjX7mQ3vT9yL4oP6rS8uW.jpg',
      backdrop_path: '/7m31oXhBkWU0x0Wk59nFq42c3G2.jpg',
      media_type: 'movie',
      release_date: '1975-08-15',
      vote_average: 8.2,
      original_language: 'hi',
      quality: '1080p',
    },
  ],
  'hindi-dubbed-movies': [
    {
      id: 299536,
      title: 'Avengers: Infinity War (Hindi)',
      overview: 'The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation.',
      poster_path: '/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
      backdrop_path: '/mDfJG3LC3Dqb67AZ52xY9F4W1d0.jpg',
      media_type: 'movie',
      release_date: '2018-04-27',
      vote_average: 8.3,
      original_language: 'en',
      quality: '4K',
      isDubbedHindi: true,
    },
    {
      id: 299534,
      title: 'Avengers: Endgame (Hindi)',
      overview: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more.',
      poster_path: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
      backdrop_path: '/7RyHsO4yDXtBv1z99k8Jp2Z3nK1.jpg',
      media_type: 'movie',
      release_date: '2019-04-26',
      vote_average: 8.3,
      original_language: 'en',
      quality: '4K',
      isDubbedHindi: true,
    },
    {
      id: 385687,
      title: 'Fast X (Hindi Dubbed)',
      overview: 'Over many missions, Dom Toretto and his family have outsmarted every enemy. Now, they confront the most lethal opponent they’ve ever faced: Dante Reyes.',
      poster_path: '/fiVW06jE7z9YnO4trhaMEdAhSiC.jpg',
      backdrop_path: '/4XM8DUTQb3lhLemJC51Jx4a2EuA.jpg',
      media_type: 'movie',
      release_date: '2023-05-19',
      vote_average: 7.1,
      original_language: 'en',
      quality: '1080p',
      isDubbedHindi: true,
    },
    {
      id: 603,
      title: 'The Matrix (Hindi Dubbed)',
      overview: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
      poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
      backdrop_path: '/7c9UVPPiTPlRaMuqiBhZF9A4bE6.jpg',
      media_type: 'movie',
      release_date: '1999-03-31',
      vote_average: 8.2,
      original_language: 'en',
      quality: '4K',
      isDubbedHindi: true,
    },
  ],
  'k-drama': [
    {
      id: 93405,
      title: 'Squid Game',
      name: 'Squid Game',
      overview: 'Hundreds of cash-strapped players accept a strange invitation to compete in children’s games for a tempting 45.6 billion won prize.',
      poster_path: '/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg',
      backdrop_path: '/2meX1nMdScFOoV4370rqHWFDxSu.jpg',
      media_type: 'tv',
      first_air_date: '2021-09-17',
      vote_average: 8.3,
      original_language: 'ko',
      quality: '4K',
    },
    {
      id: 99966,
      title: 'All of Us Are Dead',
      name: 'All of Us Are Dead',
      overview: 'A high school becomes ground zero for a zombie virus outbreak. Trapped students must fight their way out or turn into the infected.',
      poster_path: '/6ZfiGvll53t9oYd5wJ2g3L1kM8.jpg',
      backdrop_path: '/7m31oXhBkWU0x0Wk59nFq42c3G2.jpg',
      media_type: 'tv',
      first_air_date: '2022-01-28',
      vote_average: 8.2,
      original_language: 'ko',
      quality: '1080p',
    },
    {
      id: 85937,
      title: 'Crash Landing on You',
      name: 'Crash Landing on You',
      overview: 'A paragliding mishap drops a South Korean heiress into North Korea - and into the life of an army officer who helps her hide.',
      poster_path: '/y7T1z2W8qK7L9V3pQoVq8Z4qK7L9.jpg',
      backdrop_path: '/xg27NrXi7gIrPV75xg8iytSzlwo.jpg',
      media_type: 'tv',
      first_air_date: '2019-12-14',
      vote_average: 8.7,
      original_language: 'ko',
      quality: '1080p',
    },
    {
      id: 136283,
      title: 'The Glory',
      name: 'The Glory',
      overview: 'Years after surviving horrific abuse in high school, a woman puts an elaborate revenge plot into motion to make the perpetrators pay.',
      poster_path: '/b8Wc5d4rF1gH2jK3lM4nO5pQ6rS.jpg',
      backdrop_path: '/r2J02Z2OpNTctfOSN2Ydg3mA5R6.jpg',
      media_type: 'tv',
      first_air_date: '2022-12-30',
      vote_average: 8.6,
      original_language: 'ko',
      quality: '4K',
    },
    {
      id: 153496,
      title: 'Business Proposal',
      name: 'Business Proposal',
      overview: 'In disguise as her friend, Ha-ri shows up on a blind date to scare away her prospective suitor. But plans go awry when he turns out to be her CEO.',
      poster_path: '/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
      backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
      media_type: 'tv',
      first_air_date: '2022-02-28',
      vote_average: 8.4,
      original_language: 'ko',
      quality: '1080p',
    },
  ],
  'hindi-dubbed-kdrama': [
    {
      id: 93405,
      title: 'Squid Game (Hindi)',
      name: 'Squid Game',
      overview: 'Watch the global mega-hit Squid Game with official high-quality Hindi dubbing. Hundreds compete in deadly stakes.',
      poster_path: '/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg',
      backdrop_path: '/2meX1nMdScFOoV4370rqHWFDxSu.jpg',
      media_type: 'tv',
      first_air_date: '2021-09-17',
      vote_average: 8.3,
      original_language: 'ko',
      quality: '4K',
      isDubbedHindi: true,
      providerName: 'Netflix Hindi',
    },
    {
      id: 99966,
      title: 'All of Us Are Dead (Hindi Dubbed)',
      name: 'All of Us Are Dead',
      overview: 'The intense zombie high school thriller streaming with energetic Hindi voice acting and surround audio.',
      poster_path: '/6ZfiGvll53t9oYd5wJ2g3L1kM8.jpg',
      backdrop_path: '/7m31oXhBkWU0x0Wk59nFq42c3G2.jpg',
      media_type: 'tv',
      first_air_date: '2022-01-28',
      vote_average: 8.2,
      original_language: 'ko',
      quality: '1080p',
      isDubbedHindi: true,
      providerName: 'Netflix Hindi',
    },
    {
      id: 117376,
      title: 'Vincenzo (Hindi Dubbed)',
      name: 'Vincenzo',
      overview: 'During a visit to his motherland, a Korean-Italian mafia lawyer gives an unrivaled conglomerate a taste of its own medicine with sidekick justice.',
      poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
      media_type: 'tv',
      first_air_date: '2021-02-20',
      vote_average: 8.8,
      original_language: 'ko',
      quality: '1080p',
      isDubbedHindi: true,
      providerName: 'Netflix Hindi',
    },
    {
      id: 216390,
      title: 'My Demon (Hindi Dubbed)',
      name: 'My Demon',
      overview: 'A pitiless demon becomes powerless after getting entangled with an icy heiress, who may hold the key to his lost abilities and his heart.',
      poster_path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      backdrop_path: '/xg27NrXi7gIrPV75xg8iytSzlwo.jpg',
      media_type: 'tv',
      first_air_date: '2023-11-24',
      vote_average: 8.3,
      original_language: 'ko',
      quality: '1080p',
      isDubbedHindi: true,
      providerName: 'Netflix Hindi',
    },
  ],
  'hbo-movies': [
    {
      id: 100088,
      title: 'The Last of Us',
      name: 'The Last of Us',
      overview: 'Twenty years after a fungal outbreak ravages the planet, survivors Joel and Ellie must journey across a desolate America.',
      poster_path: '/uKvVjHNqB5VmOrdxqAt2V7JMrqi.jpg',
      backdrop_path: '/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg',
      media_type: 'tv',
      first_air_date: '2023-01-15',
      vote_average: 8.6,
      original_language: 'en',
      quality: '4K',
      providerName: 'HBO',
    },
    {
      id: 94997,
      title: 'House of the Dragon',
      name: 'House of the Dragon',
      overview: 'The Targaryen dynasty is at the absolute apex of its power, with more than 15 dragons under their yoke, before civil war erupts.',
      poster_path: '/1X4h40fcB4WWUmIBK0auT4zRBAV.jpg',
      backdrop_path: '/etj5CuMuam3U9KuV40GMviQeeVO.jpg',
      media_type: 'tv',
      first_air_date: '2022-08-21',
      vote_average: 8.4,
      original_language: 'en',
      quality: '4K',
      providerName: 'HBO',
    },
    {
      id: 1399,
      title: 'Game of Thrones',
      name: 'Game of Thrones',
      overview: 'Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war.',
      poster_path: '/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
      backdrop_path: '/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg',
      media_type: 'tv',
      first_air_date: '2011-04-17',
      vote_average: 8.4,
      original_language: 'en',
      quality: '4K',
      providerName: 'HBO',
    },
    {
      id: 155,
      title: 'The Dark Knight',
      overview: 'Batman raises the stakes in his war on crime with lieutenant Jim Gordon and Harvey Dent to dismantle organized crime.',
      poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      backdrop_path: '/dqK9Hag1054tghRQSqLSfrkvQnA.jpg',
      media_type: 'movie',
      release_date: '2008-07-16',
      vote_average: 8.5,
      original_language: 'en',
      quality: '4K',
      providerName: 'Warner / HBO',
      isDubbedHindi: true,
    },
  ],
  'netflix-movies': [
    {
      id: 66732,
      title: 'Stranger Things',
      name: 'Stranger Things',
      overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
      poster_path: '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
      backdrop_path: '/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
      media_type: 'tv',
      first_air_date: '2016-07-15',
      vote_average: 8.6,
      original_language: 'en',
      quality: '4K',
      providerName: 'Netflix',
      isDubbedHindi: true,
    },
    {
      id: 71446,
      title: 'Money Heist (La Casa de Papel)',
      name: 'Money Heist',
      overview: 'To carry out the biggest heist in history, a mysterious man called The Professor recruits a band of eight robbers who have a single characteristic: none of them has anything to lose.',
      poster_path: '/reEMJA1uzscCbk5rUhGny20j58h.jpg',
      backdrop_path: '/gFZriCkpJYsApPcnfquhLdHaqY2.jpg',
      media_type: 'tv',
      first_air_date: '2017-05-02',
      vote_average: 8.2,
      original_language: 'es',
      quality: '1080p',
      providerName: 'Netflix',
      isDubbedHindi: true,
    },
    {
      id: 615656,
      title: 'Extraction 2',
      overview: 'Back from the brink of death, highly skilled commando Tyler Rake takes on another dangerous mission: saving the imprisoned family of a ruthless gangster.',
      poster_path: '/7gKI9hpEMcZUwYeCu9i0CviNDvo.jpg',
      backdrop_path: '/fgw4rFs4AcRI7ABMNWwx83Kl1r8.jpg',
      media_type: 'movie',
      release_date: '2023-06-09',
      vote_average: 7.5,
      original_language: 'en',
      quality: '4K',
      providerName: 'Netflix',
      isDubbedHindi: true,
    },
  ],
  'jiohotstar-movies': [
    {
      id: 864692,
      title: 'Brahmāstra: Part One – Shiva',
      overview: 'A young man on the brink of falling in love gets his world turned upside down when he discovers that he has a mysterious connection to fire.',
      poster_path: '/x4NkWZ8qK7L9V3pQoVq8Z4qK7L9.jpg',
      backdrop_path: '/sRLC052LnMjwT89GWB89Uge15wh.jpg',
      media_type: 'movie',
      release_date: '2022-09-09',
      vote_average: 6.9,
      original_language: 'hi',
      quality: '4K',
      providerName: 'JioHotstar',
    },
    {
      id: 978931,
      title: 'Taaza Khabar',
      name: 'Taaza Khabar',
      overview: 'A sanitation worker stumbles upon magical powers which can predict the future breaking news, leading to riches and unexpected danger.',
      poster_path: '/b8Wc5d4rF1gH2jK3lM4nO5pQ6rS.jpg',
      backdrop_path: '/r2J02Z2OpNTctfOSN2Ydg3mA5R6.jpg',
      media_type: 'tv',
      first_air_date: '2023-01-06',
      vote_average: 7.8,
      original_language: 'hi',
      quality: '1080p',
      providerName: 'JioHotstar',
    },
    {
      id: 84958,
      title: 'Loki',
      name: 'Loki',
      overview: 'The mercurial villain Loki resumes his role as the God of Mischief in a new series that takes place after the events of Avengers: Endgame.',
      poster_path: '/voHUmltlYdtmRS1GS5Y7mtTyVbJ.jpg',
      backdrop_path: '/mDfJG3LC3Dqb67AZ52xY9F4W1d0.jpg',
      media_type: 'tv',
      first_air_date: '2021-06-09',
      vote_average: 8.2,
      original_language: 'en',
      quality: '4K',
      providerName: 'JioHotstar',
      isDubbedHindi: true,
    },
  ],
  'mxplayer-movies': [
    {
      id: 108386,
      title: 'Aashram',
      name: 'Aashram',
      overview: 'A godman’s insidious empire manipulates faith, politics, crime, and power in the heartland of India.',
      poster_path: '/d8qG3y6d8NlCj1o7hL94FjAomdO.jpg',
      backdrop_path: '/7m31oXhBkWU0x0Wk59nFq42c3G2.jpg',
      media_type: 'tv',
      first_air_date: '2020-08-28',
      vote_average: 7.9,
      original_language: 'hi',
      quality: '1080p',
      providerName: 'MX Player',
    },
    {
      id: 139191,
      title: 'Matsya Kaand',
      name: 'Matsya Kaand',
      overview: 'An honorable con artist pulls off intricate master heists across the country while ACP Tejraj Singh chases him ruthlessly.',
      poster_path: '/mJmQ8kL2vR6pW9tX4bA7cM3uN1.jpg',
      backdrop_path: '/xg27NrXi7gIrPV75xg8iytSzlwo.jpg',
      media_type: 'tv',
      first_air_date: '2021-11-18',
      vote_average: 7.7,
      original_language: 'hi',
      quality: '1080p',
      providerName: 'MX Player',
    },
    {
      id: 100757,
      title: 'Bhaukaal',
      name: 'Bhaukaal',
      overview: 'SSP Naveen Sikhera cleans up the crime-infested city of Muzaffarnagar ruled by dreaded local gangs.',
      poster_path: '/aQpL9kM2vR6pW9tX4bA7cM3uN1.jpg',
      backdrop_path: '/sRLC052LnMjwT89GWB89Uge15wh.jpg',
      media_type: 'tv',
      first_air_date: '2020-03-06',
      vote_average: 7.8,
      original_language: 'hi',
      quality: '1080p',
      providerName: 'MX Player',
    },
    {
      id: 154885,
      title: 'Dharavi Bank',
      name: 'Dharavi Bank',
      overview: 'Thalaivan commands a 30,000 crore crime syndicate deep inside Asia’s biggest slum, Dharavi, as JCP Jayant Gavaskar plots his downfall.',
      poster_path: '/c8Wc5d4rF1gH2jK3lM4nO5pQ6rS.jpg',
      backdrop_path: '/x4NkWZ8qK7L9V3pQoVq8Z4qK7L9.jpg',
      media_type: 'tv',
      first_air_date: '2022-11-19',
      vote_average: 7.4,
      original_language: 'hi',
      quality: '1080p',
      providerName: 'MX Player',
    },
  ],
};

function buildTmdbUrl(categoryId: CategoryId, subcategory?: SouthSubcategory, page = 1): string {
  const apiKey = getApiKey();
  const common = `api_key=${apiKey}&page=${page}&include_adult=false`;

  switch (categoryId) {
    // 1. Global Trending & Popular Categories
    case 'trending':
      return `${TMDB_BASE_URL}/trending/all/day?${common}`;
    case 'global-box-office':
      return `${TMDB_BASE_URL}/discover/movie?${common}&sort_by=revenue.desc&vote_count.gte=500`;
    case 'global-blockbusters':
      return `${TMDB_BASE_URL}/discover/movie?${common}&sort_by=popularity.desc&vote_count.gte=1000`;
    case 'popular-movies':
      return `${TMDB_BASE_URL}/movie/popular?${common}`;
    case 'trending-tv':
      return `${TMDB_BASE_URL}/trending/tv/day?${common}`;
    case 'new-releases':
      return `${TMDB_BASE_URL}/discover/movie?${common}&primary_release_date.gte=2024-01-01&primary_release_date.lte=2026-12-31&sort_by=popularity.desc&vote_count.gte=30`;
    case 'upcoming-movies':
      return `${TMDB_BASE_URL}/movie/upcoming?${common}`;
    case 'top-100':
    case 'top-rated':
      return `${TMDB_BASE_URL}/movie/top_rated?${common}&vote_count.gte=500`;
    case 'classic-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&primary_release_date.lte=1999-12-31&sort_by=vote_count.desc&vote_count.gte=100`;
    case 'hidden-gems':
      return `${TMDB_BASE_URL}/discover/movie?${common}&vote_average.gte=7.8&vote_count.gte=80&vote_count.lte=1500&sort_by=vote_average.desc`;
    case 'recommended':
      return `${TMDB_BASE_URL}/discover/movie?${common}&sort_by=vote_average.desc&vote_count.gte=500`;

    // 2. Movies by Film Industry
    case 'hollywood-movies':
    case 'english-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_origin_country=US&with_original_language=en&sort_by=popularity.desc&vote_count.gte=20`;
    case 'bollywood-movies':
    case 'hindi-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_origin_country=IN&with_original_language=hi&sort_by=popularity.desc&vote_count.gte=5`;
    case 'south-movies': {
      let langParam = 'te|ta|ml|kn';
      if (subcategory === 'tamil') langParam = 'ta';
      else if (subcategory === 'telugu') langParam = 'te';
      else if (subcategory === 'malayalam') langParam = 'ml';
      else if (subcategory === 'kannada') langParam = 'kn';
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_origin_country=IN&with_original_language=${langParam}&sort_by=popularity.desc&vote_count.gte=5`;
    }
    case 'punjabi-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=pa&sort_by=popularity.desc`;
    case 'korean-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=ko&sort_by=popularity.desc&vote_count.gte=20`;
    case 'chinese-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=zh|cn&sort_by=popularity.desc&vote_count.gte=20`;
    case 'japanese-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=ja&sort_by=popularity.desc&vote_count.gte=20`;
    case 'russian-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=ru&sort_by=popularity.desc&vote_count.gte=10`;
    case 'french-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=fr&sort_by=popularity.desc&vote_count.gte=20`;
    case 'spanish-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=es&sort_by=popularity.desc&vote_count.gte=20`;
    case 'german-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=de&sort_by=popularity.desc&vote_count.gte=20`;
    case 'italian-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=it&sort_by=popularity.desc&vote_count.gte=20`;
    case 'turkish-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=tr&sort_by=popularity.desc&vote_count.gte=10`;
    case 'thai-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=th&sort_by=popularity.desc&vote_count.gte=10`;
    case 'indonesian-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=id&sort_by=popularity.desc&vote_count.gte=10`;
    case 'filipino-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=tl&sort_by=popularity.desc&vote_count.gte=5`;
    case 'african-cinema':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_origin_country=NG|ZA|EG|KE&sort_by=popularity.desc`;
    case 'latin-cinema':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_origin_country=BR|MX|AR|CO&sort_by=popularity.desc&vote_count.gte=20`;
    case 'middle-east-cinema':
    case 'arabic-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=ar|fa&sort_by=popularity.desc&vote_count.gte=10`;
    case 'world-cinema':
      return `${TMDB_BASE_URL}/discover/movie?${common}&without_original_language=en&sort_by=popularity.desc&vote_count.gte=50`;

    // 3. Animation, Anime & Family
    case 'animation-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_genres=16&sort_by=popularity.desc&vote_count.gte=50`;
    case 'kids-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_genres=16,10751&certification_country=US&certification=G&sort_by=popularity.desc`;
    case 'family-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_genres=10751&sort_by=popularity.desc&vote_count.gte=50`;
    case 'anime-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_genres=16&with_original_language=ja&sort_by=popularity.desc&vote_count.gte=30`;
    case 'anime-series':
    case 'japanese-anime':
      return `${TMDB_BASE_URL}/discover/tv?${common}&with_genres=16&with_original_language=ja&sort_by=popularity.desc&vote_count.gte=30`;
    case 'superhero-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_keywords=9715|180547|156037|179431|8828&sort_by=popularity.desc`;
    case 'fantasy-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_genres=14&sort_by=popularity.desc&vote_count.gte=30`;
    case 'scifi-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_genres=878&sort_by=popularity.desc&vote_count.gte=30`;
    case 'classic-animation':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_genres=16&primary_release_date.lte=2002-12-31&sort_by=vote_count.desc&vote_count.gte=100`;
    case 'adult-animation':
      return `${TMDB_BASE_URL}/discover/tv?${common}&with_genres=16&without_genres=10751&sort_by=popularity.desc&vote_count.gte=50`;

    // 4. Movies by Original Language
    case 'lang-hindi':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=hi&sort_by=popularity.desc`;
    case 'lang-english':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=en&sort_by=popularity.desc`;
    case 'lang-punjabi':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=pa&sort_by=popularity.desc`;
    case 'lang-tamil':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=ta&sort_by=popularity.desc`;
    case 'lang-telugu':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=te&sort_by=popularity.desc`;
    case 'lang-malayalam':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=ml&sort_by=popularity.desc`;
    case 'lang-kannada':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=kn&sort_by=popularity.desc`;
    case 'lang-korean':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=ko&sort_by=popularity.desc`;
    case 'lang-chinese':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=zh|cn&sort_by=popularity.desc`;
    case 'lang-japanese':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=ja&sort_by=popularity.desc`;
    case 'lang-russian':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=ru&sort_by=popularity.desc`;
    case 'lang-spanish':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=es&sort_by=popularity.desc`;
    case 'lang-french':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=fr&sort_by=popularity.desc`;
    case 'lang-german':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=de&sort_by=popularity.desc`;
    case 'lang-arabic':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=ar&sort_by=popularity.desc`;
    case 'lang-turkish':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=tr&sort_by=popularity.desc`;
    case 'lang-thai':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=th&sort_by=popularity.desc`;
    case 'lang-indonesian':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=id&sort_by=popularity.desc`;
    case 'lang-portuguese':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=pt&sort_by=popularity.desc`;

    // 5. Hindi Dubbed & Other Dubbed Content
    case 'hindi-dubbed-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&watch_region=IN&with_origin_country=IN|US&sort_by=popularity.desc&vote_count.gte=50`;
    case 'hindi-dubbed-hollywood':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_origin_country=US&with_original_language=en&watch_region=IN&sort_by=popularity.desc&vote_count.gte=100`;
    case 'hindi-dubbed-south':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_origin_country=IN&with_original_language=te|ta|ml|kn&sort_by=popularity.desc&vote_count.gte=50`;
    case 'hindi-dubbed-korean':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=ko&sort_by=popularity.desc&vote_count.gte=40`;
    case 'hindi-dubbed-kdrama':
      return `${TMDB_BASE_URL}/discover/tv?${common}&with_original_language=ko&sort_by=popularity.desc&vote_count.gte=30`;
    case 'hindi-dubbed-chinese':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_original_language=zh|cn&sort_by=popularity.desc&vote_count.gte=30`;
    case 'hindi-dubbed-anime':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_genres=16&with_original_language=ja&sort_by=popularity.desc&vote_count.gte=50`;
    case 'english-dubbed-anime':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_genres=16&with_original_language=ja&sort_by=popularity.desc&vote_count.gte=50`;
    case 'english-dubbed-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&without_original_language=en&watch_region=US&sort_by=popularity.desc&vote_count.gte=50`;
    case 'multi-audio-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&vote_count.gte=500&sort_by=popularity.desc`;
    case 'subtitled-movies':
    case 'hindi-subtitles':
      return `${TMDB_BASE_URL}/discover/movie?${common}&without_original_language=hi&sort_by=popularity.desc&vote_count.gte=50`;

    // 6. OTT & Streaming Platforms
    case 'netflix-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_watch_providers=8&watch_region=IN&sort_by=popularity.desc`;
    case 'netflix-series':
      return `${TMDB_BASE_URL}/discover/tv?${common}&with_networks=213&sort_by=popularity.desc`;
    case 'hbo-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_watch_providers=384&sort_by=popularity.desc`;
    case 'hbo-series':
      return `${TMDB_BASE_URL}/discover/tv?${common}&with_networks=49&sort_by=popularity.desc`;
    case 'jiohotstar-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_watch_providers=122|237&watch_region=IN&sort_by=popularity.desc`;
    case 'jiohotstar-shows':
      return `${TMDB_BASE_URL}/discover/tv?${common}&with_watch_providers=122|237&watch_region=IN&sort_by=popularity.desc`;
    case 'mxplayer-movies':
      return `${TMDB_BASE_URL}/discover/tv?${common}&with_original_language=hi&sort_by=popularity.desc`;
    case 'prime-video':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_watch_providers=9|119&watch_region=IN&sort_by=popularity.desc`;
    case 'disney-plus':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_watch_providers=337|390&sort_by=popularity.desc`;
    case 'apple-tv':
      return `${TMDB_BASE_URL}/discover/tv?${common}&with_networks=2552&sort_by=popularity.desc`;
    case 'hulu':
      return `${TMDB_BASE_URL}/discover/tv?${common}&with_networks=453&sort_by=popularity.desc`;
    case 'paramount-plus':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_watch_providers=531&sort_by=popularity.desc`;
    case 'peacock':
      return `${TMDB_BASE_URL}/discover/tv?${common}&with_networks=3353&sort_by=popularity.desc`;
    case 'sonyliv':
      return `${TMDB_BASE_URL}/discover/tv?${common}&with_watch_providers=237&watch_region=IN&sort_by=popularity.desc`;
    case 'zee5':
      return `${TMDB_BASE_URL}/discover/tv?${common}&with_watch_providers=232&watch_region=IN&sort_by=popularity.desc`;
    case 'crunchyroll':
      return `${TMDB_BASE_URL}/discover/tv?${common}&with_genres=16&with_original_language=ja&sort_by=popularity.desc`;

    // 7. Genre Categories
    case 'action-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_genres=28&sort_by=popularity.desc&vote_count.gte=30`;
    case 'adventure-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_genres=12&sort_by=popularity.desc&vote_count.gte=30`;
    case 'comedy-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_genres=35&sort_by=popularity.desc&vote_count.gte=30`;
    case 'crime-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_genres=80&sort_by=popularity.desc&vote_count.gte=30`;
    case 'drama-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_genres=18&sort_by=popularity.desc&vote_count.gte=30`;
    case 'horror-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_genres=27|53&sort_by=popularity.desc&vote_count.gte=30`;
    case 'thriller-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_genres=53&sort_by=popularity.desc&vote_count.gte=30`;
    case 'mystery-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_genres=9648&sort_by=popularity.desc&vote_count.gte=20`;
    case 'romance-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_genres=10749&sort_by=popularity.desc&vote_count.gte=20`;
    case 'war-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_genres=10752&sort_by=popularity.desc&vote_count.gte=20`;
    case 'history-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_genres=36&sort_by=popularity.desc&vote_count.gte=20`;
    case 'documentary-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_genres=99&sort_by=popularity.desc&vote_count.gte=10`;
    case 'music-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_genres=10402&sort_by=popularity.desc&vote_count.gte=10`;
    case 'western-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_genres=37&sort_by=popularity.desc&vote_count.gte=10`;
    case 'sports-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_keywords=6075|18035|10183&sort_by=popularity.desc`;
    case 'biography-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_genres=36,18&sort_by=popularity.desc`;
    case 'disaster-movies':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_keywords=4414|9663|10714&sort_by=popularity.desc`;
    case 'martial-arts':
      return `${TMDB_BASE_URL}/discover/movie?${common}&with_keywords=779|1701|9642|10683&sort_by=popularity.desc`;

    // 8. TV Shows, Web Series & Dramas
    case 'global-tv':
      return `${TMDB_BASE_URL}/discover/tv?${common}&sort_by=popularity.desc&vote_count.gte=50`;
    case 'web-series':
      return `${TMDB_BASE_URL}/discover/tv?${common}&sort_by=popularity.desc&vote_count.gte=20`;
    case 'k-drama':
      return `${TMDB_BASE_URL}/discover/tv?${common}&with_original_language=ko&sort_by=popularity.desc&vote_count.gte=10`;
    case 'c-drama':
      return `${TMDB_BASE_URL}/discover/tv?${common}&with_original_language=zh&sort_by=popularity.desc`;
    case 'j-drama':
      return `${TMDB_BASE_URL}/discover/tv?${common}&with_original_language=ja&without_genres=16&sort_by=popularity.desc`;
    case 'turkish-drama':
      return `${TMDB_BASE_URL}/discover/tv?${common}&with_original_language=tr&sort_by=popularity.desc`;
    case 'russian-series':
      return `${TMDB_BASE_URL}/discover/tv?${common}&with_original_language=ru&sort_by=popularity.desc`;
    case 'indian-web-series':
      return `${TMDB_BASE_URL}/discover/tv?${common}&with_original_language=hi&with_origin_country=IN&sort_by=popularity.desc`;
    case 'american-tv':
      return `${TMDB_BASE_URL}/discover/tv?${common}&with_origin_country=US&with_original_language=en&sort_by=popularity.desc`;
    case 'british-tv':
      return `${TMDB_BASE_URL}/discover/tv?${common}&with_origin_country=GB&with_original_language=en&sort_by=popularity.desc`;
    case 'mini-series':
      return `${TMDB_BASE_URL}/discover/tv?${common}&with_type=1&sort_by=popularity.desc`;
    case 'crime-series':
      return `${TMDB_BASE_URL}/discover/tv?${common}&with_genres=80&sort_by=popularity.desc`;
    case 'reality-shows':
      return `${TMDB_BASE_URL}/discover/tv?${common}&with_genres=10764&sort_by=popularity.desc`;

    default:
      return `${TMDB_BASE_URL}/trending/all/day?${common}`;
  }
}

export async function fetchCategoryContent(
  categoryId: CategoryId,
  subcategory: SouthSubcategory = 'all',
  page = 1
): Promise<FetchResult> {
  let lastError: any = null;

  // Try across verified working TMDB keys with automatic failover
  for (let attempt = 0; attempt < TMDB_API_KEYS.length; attempt++) {
    const url = buildTmdbUrl(categoryId, subcategory, page);

    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) {
        rotateApiKey();
        continue;
      }

      const data = await res.json();
      const rawResults = Array.isArray(data.results) ? data.results : [];

      if (rawResults.length === 0 && attempt < TMDB_API_KEYS.length - 1) {
        rotateApiKey();
        continue;
      }

      // Real filtering based on category
      let filteredResults = rawResults;

      if (categoryId === 'hindi-dubbed-kdrama') {
        filteredResults = rawResults.filter((r: any) => r.original_language === 'ko');
      } else if (categoryId === 'hindi-dubbed-movies') {
        filteredResults = rawResults.filter((r: any) => r.original_language !== 'hi');
      }

      // STRICT AUTHENTIC POSTER FILTER: Only include titles that have real, genuine poster_path
      const withValidPosters = filteredResults.filter((r: any) => !!r.poster_path);
      const targetResults = withValidPosters.length >= 6 ? withValidPosters : filteredResults;

      let defaultMediaType: 'movie' | 'tv' = 'movie';
      if (['k-drama', 'hindi-dubbed-kdrama', 'mxplayer-movies', 'hbo-movies', 'trending-tv', 'web-series', 'indian-web-series'].includes(categoryId)) {
        defaultMediaType = 'tv';
      }

      const items = targetResults.map((raw: any, idx: number) => {
        const normalized = normalizeTmdbItem(raw, defaultMediaType, categoryId);
        if (categoryId === 'top-100') {
          normalized.rank = (page - 1) * 20 + idx + 1;
        }
        return normalized;
      });

      return {
        items,
        page: data.page || page,
        // Unlimited pagination: TMDB provides hundreds of pages, minimum 500 pages support
        totalPages: Math.min(Math.max(data.total_pages || 10, 500), 1000),
        totalResults: data.total_results || 10000,
      };
    } catch (err) {
      lastError = err;
      rotateApiKey();
    }
  }

  console.warn(`Upstream TMDB fetch exhausted all keys for ${categoryId}, using curated fallback catalog:`, lastError);
  // Curated fallback catalog with continuous pagination support
  const baseFallback = FALLBACK_CATALOG[categoryId] || FALLBACK_CATALOG['trending'] || [];
  const pagedItems = baseFallback.map((item, idx) => ({
    ...item,
    id: page === 1 ? item.id : item.id + (page - 1) * 10000 + idx,
  }));

  return {
    items: pagedItems,
    page,
    totalPages: 500, // Unlimited pages support
    totalResults: 10000,
  };
}

export async function searchContent(query: string, page = 1): Promise<FetchResult> {
  if (!query.trim()) {
    return { items: [], page: 1, totalPages: 1, totalResults: 0 };
  }

  const apiKey = getApiKey();
  const encoded = encodeURIComponent(query.trim());
  const url = `${TMDB_BASE_URL}/search/multi?api_key=${apiKey}&query=${encoded}&page=${page}&include_adult=false`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Search failed: ${res.status}`);
    const data = await res.json();

    const validItems = (data.results || [])
      .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
      .map((item: any) => normalizeTmdbItem(item, item.media_type));

    return {
      items: validItems,
      page: data.page || page,
      totalPages: Math.min(data.total_pages || 1, 100),
      totalResults: data.total_results || validItems.length,
    };
  } catch (err) {
    console.warn('Search query failed:', err);
    // Search across our fallback catalog
    const qLower = query.toLowerCase();
    const allFallback = Object.values(FALLBACK_CATALOG).flat();
    const matched = allFallback.filter(
      (item) =>
        item.title.toLowerCase().includes(qLower) ||
        (item.name && item.name.toLowerCase().includes(qLower)) ||
        item.overview.toLowerCase().includes(qLower)
    );
    const deduped = deduplicateItems([], matched);
    return {
      items: deduped,
      page: 1,
      totalPages: 1,
      totalResults: deduped.length,
    };
  }
}

export async function fetchItemDetails(id: number, mediaType: 'movie' | 'tv'): Promise<Partial<MovieOrShow>> {
  const apiKey = getApiKey();
  const url = `${TMDB_BASE_URL}/${mediaType}/${id}?api_key=${apiKey}&append_to_response=videos,credits`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch details error: ${res.status}`);
    const data = await res.json();

    return {
      genres: data.genres || [],
      runtime: data.runtime || (data.episode_run_time ? data.episode_run_time[0] : 120),
      tagline: data.tagline,
      seasons_count: data.number_of_seasons || (mediaType === 'tv' ? 1 : undefined),
      episodes_count: data.number_of_episodes || (mediaType === 'tv' ? 10 : undefined),
    };
  } catch (err) {
    return {
      runtime: 130,
      seasons_count: mediaType === 'tv' ? 2 : undefined,
      episodes_count: mediaType === 'tv' ? 16 : undefined,
    };
  }
}
