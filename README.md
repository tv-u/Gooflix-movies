# 🎬 GOO TV - Movies, Web Series & Live Cinema

A high-performance, responsive worldwide movie and TV discovery streaming web application built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Vite**.

Designed to be 100% **Google SEO-friendly**, **GitHub Pages-friendly**, and **Cloudflare Pages-friendly**.

---

## 🌟 Key Features

- **Original Movie Posters**: Official verified TMDB CDN images for every title with high-contrast metadata badges.
- **Unlimited Pagination Across All Categories**:
  - 3D Highlight **Next Page (अगला पेज ❯)** button for smooth page navigation.
  - **Load More (+ और लोड करें)** button for continuous infinite stream.
  - Dedicated **Previous Page (❮ पिछला पेज)** and **Page Jump** input.
  - Unlimited 500+ pages support for all 128 categories.
- **Deduplication Engine**: Guaranteed zero duplicate movie posters or titles across pages.
- **Cinema Details & Download Window**:
  - High-definition backdrop, movie trailer embed, and verified audio/subtitle tracks.
  - 4-Tier verified direct download cards (4K UHD, 1080p, 720p, 480p).
  - Clean Window Pop-out Player mode.
- **Multi-Server Streaming**: 20 fast auto-sync servers with failover protection.
- **Player Controls**: 10-second skip & back, Bilibili-style brightness slider, MX Player-style volume slider, quality selection, and subtitles.
- **Google & Cloudflare Ready**:
  - Schema.org JSON-LD structured data.
  - Full OpenGraph & Twitter social cards.
  - `sitemap.xml` & `robots.txt` included.
  - Cloudflare Pages `_headers` with immutable cache rules and security headers.
  - GitHub Pages single-page-app (SPA) redirect support via `404.html` and `.nojekyll`.

---

## 🚀 Quick Start (Development)

```bash
# 1. Install dependencies
npm install

# 2. Start local Vite development server
npm run dev
```

App will run at `http://localhost:3000`.

---

## 📦 Production Build

```bash
# Build production bundle to /dist
npm run build
```

---

## 🌐 Deployment

### 1. GitHub Pages
1. Push repository to GitHub.
2. In Repository Settings -> Pages:
   - Source: Deploy from branch -> Select `gh-pages` or `/dist` (or use GitHub Actions).
3. The included `404.html` and `.nojekyll` in `public/` guarantee zero 404s on page reload.

### 2. Cloudflare Pages
1. Connect repository in Cloudflare Pages dashboard.
2. Build command: `npm run build`
3. Output directory: `dist`
4. The included `public/_headers` and `public/_redirects` automatically optimize asset caching and handle client-side routing.

---

## 📄 License
MIT © 2026 GOO TV Network
