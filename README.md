# 🎬 GOO TV — Worldwide Movie & TV Discovery Platform

> **Free, High-Speed, Worldwide Movie & TV Discovery Web Application** with 128 Categories, 20 Zero-Sandbox Streaming Servers, Unlimited Upstream Pagination, Advanced Search, Clean Cinema Window, and Smart Adsterra Monetization.

---

## 🌟 Key Features

- **⚡ 20 Zero-Sandbox Streaming CDN Servers**:
  - SuperEmbed Ultra (4K), AutoEmbed CC (Smart), Embed.su (VIP CDN), VidSrc Net, SmashyStream, 2Embed, VidSrc.xyz, MoviesAPI Club, RiveStream, VidFast, Filemoon, StreamWish, DoodStream, StreamTape, Upstream, Voe.sx, Vidguard, VidSrc PM, VidLink, and Noni.to.
  - Manual server switching with vibrant **Full HD 3D Highlight "Next Server" Button**.
- **🌍 128 Worldwide Blueprint Categories**:
  - **Global Trending**: Global Box Office, Blockbusters, Trending TV, New Releases, Upcoming, Top Rated, Hidden Gems, All-Time Classics.
  - **Movies by Film Industry**: Hollywood, Bollywood, South Indian (Tamil, Telugu, Malayalam, Kannada), Punjabi, Korean, Chinese, Japanese, Russian, French, Spanish, German, Italian, Turkish, Thai, Indonesian, African, Latin American, World Cinema.
  - **Animation & Anime**: Anime Movies, Anime Series, Animation, Kids & Family, Superhero, Sci-Fi, Fantasy.
  - **Languages**: Hindi, English, Punjabi, Tamil, Telugu, Malayalam, Kannada, Korean, Chinese, Japanese, Russian, Spanish, French, German, Arabic, Turkish, and more.
  - **Hindi Dubbed & Multi-Audio**: Hindi Dubbed Hollywood, South, K-Drama, Anime, Multi-Audio, Subtitles.
  - **OTT Platforms**: Netflix, HBO Max, JioHotstar, Amazon Prime Video, Disney+, Apple TV+, MX Player, Zee5, SonyLIV, Crunchyroll.
  - **Genres**: Action, Comedy, Drama, Horror, Thriller, Romance, Sci-Fi, Crime, Mystery, Fantasy, War, History.
  - **TV Shows & Web Series**: Global TV, Indian Web Series, K-Dramas, C-Dramas, Crime Series, Reality Shows.
- **📱 Mega Navigation Menu (मेन्यू)**:
  - 128 categories directory with instant keyword search filter.
  - Quick utility tiles: 20 Servers Switcher, 50 Languages, My Watchlist, Clean Window Mode, Surprise Me / Random Movie, and Top 100 Hub.
- **🔍 Advanced Live Instant Search**:
  - Debounced real-time upstream queries with default instant popular recommendations and quick keyword pills.
- **🔄 Unlimited Pagination**:
  - Direct Page Jump input, Prev/Next page navigation, and optional Auto-Infinite continuous scroll.
- **🎨 Modern Cinema Player**:
  - MX Player & Bilibili style vertical swipe gestures: Screen Brightness (left) and Volume Boost up to 200% (right).
  - 10-second fast skip & rewind (`-10s` / `+10s`), quality selector, audio track selector (Hindi / English / South), and subtitles.
- **🚀 Cloudflare, GitHub & Google SEO Ready**:
  - Schema.org JSON-LD structured data, preconnect CDN tags, `_headers` caching rules, and semantic landmarks.

---

## 🛠️ Quick Start & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/goo-tv.git
cd goo-tv
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Build for Production
```bash
npm run build
```
The optimized production build will be generated in the `dist` directory.

---

## 🚀 How to Push to Your GitHub Repository

If you want to push this project to a new repository on GitHub:

```bash
# 1. Initialize git (if not already initialized)
git init
git branch -M main

# 2. Stage all files & commit
git add .
git commit -m "feat: complete GOO TV platform with 20 servers, unlimited pagination & mega menu"

# 3. Add your GitHub remote repository URL
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# 4. Push to main branch
git push -u origin main
```

---

## ☁️ Deployment Guides

### Deploy to Cloudflare Pages (Recommended)
1. Push your repository to GitHub.
2. In Cloudflare Dashboard, go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your `goo-tv` repository.
4. Set Build Settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click **Save and Deploy**. Cloudflare edge caching will be configured automatically via the included `_headers` file.

### Deploy to Vercel
1. Import repository on Vercel Dashboard.
2. Framework: `Vite`.
3. Click **Deploy**.

---

## 📄 License & Disclaimer
This project is for educational and discovery purposes only. All movie metadata and artwork are provided by TMDB API. Streams are embedded from third-party decentralized providers.
