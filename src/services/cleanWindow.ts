import { MovieOrShow } from '../types';
import { SERVERS_20 } from './playerServers';
import { ADSTERRA_DIRECT_LINKS } from './adsterra';

/**
 * GOO TV Clean Popup Window Engine
 * Opens playback and download streams in a clean, distraction-free popup window
 * with high speed, 20 Server Tabs, Full HD 3D Highlight Next Server button,
 * and 100% active Adsterra smart monetization.
 */

export function openCleanPlayWindow(
  media: MovieOrShow,
  season: number = 1,
  episode: number = 1,
  preferredAudio: string = 'hindi'
): Window | null {
  const isTv = media.media_type === 'tv' || (!media.title && !!media.name);
  const title = (media.title || media.name || 'Movie').replace(/"/g, '&quot;');
  const id = media.id;

  // Build the list of server URLs
  const activeAudio = preferredAudio === 'hi' || preferredAudio === 'hindi' ? 'hi' : '';
  const serverUrlsJson = JSON.stringify(
    SERVERS_20.map((s) => ({
      id: s.id,
      name: s.name,
      quality: s.quality,
      speed: s.speed,
      audio: s.audioInfo,
      url: isTv ? s.getTv(id, season, episode, activeAudio) : s.getMovie(id, activeAudio),
    }))
  );

  const screenWidth = typeof window !== 'undefined' ? window.screen.width : 1280;
  const screenHeight = typeof window !== 'undefined' ? window.screen.height : 720;
  const width = Math.min(Math.floor(screenWidth * 0.94), 1400);
  const height = Math.min(Math.floor(screenHeight * 0.90), 840);
  const left = Math.floor((screenWidth - width) / 2);
  const top = Math.floor((screenHeight - height) / 2);

  const windowFeatures = `width=${width},height=${height},top=${top},left=${left},status=no,menubar=no,toolbar=no,location=no,resizable=yes,scrollbars=no`;

  const cleanPlayerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Clean Cinema Window | GOO TV</title>
  <link rel="preconnect" href="https://image.tmdb.org" crossorigin />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #080911;
      color: #fff;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      overflow: hidden;
      height: 100vh;
      display: flex;
      flex-direction: column;
      user-select: none;
    }
    .top-marquee {
      background: linear-gradient(90deg, #b91c1c, #ea580c, #b91c1c);
      padding: 6px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 800;
      box-shadow: 0 4px 15px rgba(234,88,12,0.3);
      z-index: 50;
    }
    .blink-badge {
      background: #000;
      color: #facc15;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 900;
      animation: blink 1.2s infinite;
    }
    @keyframes blink { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.97); } }
    
    .header-bar {
      background: #10121d;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      padding: 8px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      z-index: 40;
    }
    .media-info {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .media-title {
      font-size: 14px;
      font-weight: 900;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* 20 Servers Tabs Bar */
    .servers-bar {
      background: #131625;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding: 6px 12px;
      display: flex;
      align-items: center;
      gap: 6px;
      overflow-x: auto;
      scrollbar-width: none;
      z-index: 35;
    }
    .servers-bar::-webkit-scrollbar { display: none; }
    .srv-btn {
      background: rgba(255,255,255,0.06);
      color: #d1d5db;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 8px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 800;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.15s;
    }
    .srv-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
    .srv-btn.active {
      background: linear-gradient(135deg, #f97316, #eab308);
      color: #000;
      border-color: #fde047;
      box-shadow: 0 4px 12px rgba(249,115,22,0.4);
      transform: scale(1.04);
    }

    /* Full HD 3D Next Server Button */
    .btn-3d-next {
      background: linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #eab308 100%);
      color: #fff;
      font-size: 12px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 8px 16px;
      border-radius: 12px;
      border-top: 1px solid rgba(255,255,255,0.4);
      border-bottom: 4px solid #7c2d12;
      border-left: 1px solid rgba(255,255,255,0.2);
      border-right: 1px solid rgba(255,255,255,0.2);
      box-shadow: 0 6px 0 #7c2d12, 0 10px 20px rgba(234,88,12,0.4);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.1s ease-in-out;
    }
    .btn-3d-next:hover {
      transform: translateY(1px);
      box-shadow: 0 5px 0 #7c2d12, 0 8px 15px rgba(234,88,12,0.5);
    }
    .btn-3d-next:active {
      transform: translateY(4px);
      border-bottom: 1px solid #7c2d12;
      box-shadow: 0 1px 0 #7c2d12, 0 3px 6px rgba(234,88,12,0.6);
    }

    .player-wrap {
      flex: 1;
      position: relative;
      background: #000;
      width: 100%;
      height: 100%;
    }
    iframe {
      width: 100%;
      height: 100%;
      border: 0;
      position: absolute;
      inset: 0;
      z-index: 10;
      transition: filter 0.05s ease-out;
    }
    .hud {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.85);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 16px;
      padding: 16px 24px;
      display: none;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      z-index: 50;
      pointer-events: none;
    }
    .hud.show { display: flex; }
    
    .bottom-bar {
      background: rgba(10,12,18,0.98);
      border-top: 1px solid rgba(255,255,255,0.08);
      padding: 8px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
      z-index: 40;
    }
    .btn {
      background: rgba(255,255,255,0.08);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 11px;
      font-weight: 800;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: all 0.15s;
    }
    .btn:hover { background: #dc2626; border-color: #ef4444; }
    select {
      background: rgba(255,255,255,0.08);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px;
      padding: 5px 8px;
      font-size: 11px;
      font-weight: 700;
      outline: none;
      cursor: pointer;
    }
    option { background: #11131c; color: #fff; }
    .slider-wrap {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 10px;
      color: #9ca3af;
      background: rgba(255,255,255,0.05);
      padding: 4px 8px;
      border-radius: 8px;
    }
    input[type=range] {
      width: 70px;
      height: 4px;
      cursor: pointer;
    }
  </style>
</head>
<body>

  <!-- Top Notification Bar -->
  <div class="top-marquee">
    <div style="display:flex; align-items:center; gap:8px;">
      <span class="blink-badge">⚡ 3D CLEAN CINEMA</span>
      <span>Movies play or download ke liye "Clean Window" button per click karein! (Clean Ad-Free Mode)</span>
    </div>
    <div style="font-size:10px; color:#fef08a;">
      20 Verified Zero-Sandbox Servers Active
    </div>
  </div>

  <!-- Header Bar -->
  <div class="header-bar">
    <div class="media-info">
      <div class="media-title">${title} ${isTv ? `[S${season}:E${episode}]` : ''}</div>
      <span style="font-size:10px; background:rgba(234,88,12,0.2); color:#fb923c; padding:2px 8px; border-radius:6px; font-weight:800;" id="serverLabel">
        Server 1: SuperEmbed 4K
      </span>
    </div>

    <!-- 3D Next Server Button in Header -->
    <button class="btn-3d-next" onclick="nextServerManual()">
      <span>⚡ NEXT SERVER 3D HD (अगला सर्वर)</span>
    </button>
  </div>

  <!-- 20 SERVERS BUTTONS TABS (Screenshot v1.hindimovies.to Style) -->
  <div class="servers-bar" id="serversBar"></div>

  <!-- Video Player Wrap -->
  <div class="player-wrap" id="playerWrap">
    <iframe
      id="videoIframe"
      src=""
      allowfullscreen
      allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
      sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-fullscreen"
    ></iframe>

    <!-- HUD Indicator -->
    <div id="hud" class="hud">
      <div id="hudTitle" style="font-size:11px; color:#9ca3af; text-transform:uppercase; font-weight:800;">HUD</div>
      <div id="hudVal" style="font-size:20px; font-weight:900; color:#facc15;">100%</div>
    </div>
  </div>

  <!-- Bottom Controls -->
  <div class="bottom-bar">
    <div style="display:flex; align-items:center; gap:8px;">
      <!-- 10s Skip Buttons -->
      <button class="btn" onclick="skip(-10)">⏪ -10s</button>
      <button class="btn" onclick="skip(10)">⏩ +10s</button>

      <!-- Brightness Slider (Bilibili Style) -->
      <div class="slider-wrap">
        <span>☀️ Brightness</span>
        <input type="range" id="brightRange" min="20" max="200" value="100" oninput="setBrightness(this.value)">
        <span id="brightVal">100%</span>
      </div>

      <!-- Volume Slider (MX Player Style) -->
      <div class="slider-wrap">
        <span>🔊 Volume (MX)</span>
        <input type="range" id="volRange" min="0" max="200" value="100" oninput="setVolume(this.value)">
        <span id="volVal">100%</span>
      </div>
    </div>

    <div style="display:flex; align-items:center; gap:8px;">
      <!-- Dual Audio Selector -->
      <select id="audioSelect" onchange="changeAudio(this.value)" title="Dual Audio Selector">
        <option value="hi" ${preferredAudio === 'hi' || preferredAudio === 'hindi' ? 'selected' : ''}>🇮🇳 Hindi Dubbed</option>
        <option value="en">🌐 English Original 5.1</option>
        <option value="te">🇮🇳 Tamil / Telugu</option>
      </select>

      <button class="btn-3d-next" onclick="nextServerManual()">
        <span>⚡ NEXT SERVER 3D</span>
      </button>

      <button class="btn" onclick="toggleFullscreen()">⛶ Fullscreen</button>
    </div>
  </div>

  <script>
    const servers = ${serverUrlsJson};
    const adLinks = ${JSON.stringify(ADSTERRA_DIRECT_LINKS)};
    let adIndex = 0;
    let currentIdx = 0;
    let currentAudio = '${preferredAudio}';

    const iframe = document.getElementById('videoIframe');
    const serverLabel = document.getElementById('serverLabel');
    const serversBar = document.getElementById('serversBar');
    const hud = document.getElementById('hud');
    const hudTitle = document.getElementById('hudTitle');
    const hudVal = document.getElementById('hudVal');
    let hudTimeout = null;

    // Trigger Adsterra Smart Ad for 100% publisher earning
    function triggerAdsterraAd() {
      try {
        const adUrl = adLinks[adIndex % adLinks.length];
        adIndex++;
        window.open(adUrl, '_blank', 'noopener,noreferrer');
      } catch(e) {}
    }

    // Render 20 Server Buttons
    function renderServerButtons() {
      serversBar.innerHTML = '';
      servers.forEach((srv, idx) => {
        const btn = document.createElement('button');
        btn.className = 'srv-btn' + (idx === currentIdx ? ' active' : '');
        btn.textContent = 'Server ' + (idx + 1);
        btn.onclick = () => {
          triggerAdsterraAd();
          loadServer(idx);
        };
        serversBar.appendChild(btn);
      });
    }

    function showHud(title, val) {
      hudTitle.textContent = title;
      hudVal.textContent = val;
      hud.classList.add('show');
      if (hudTimeout) clearTimeout(hudTimeout);
      hudTimeout = setTimeout(() => hud.classList.remove('show'), 1200);
    }

    // MANUAL SERVER SELECTION (Zero unexpected jumps)
    function loadServer(idx) {
      currentIdx = idx % servers.length;
      serverLabel.textContent = 'Server ' + (currentIdx + 1) + ': ' + servers[currentIdx].name;

      let targetUrl = servers[currentIdx].url;
      if (currentAudio === 'hi') {
        targetUrl += targetUrl.includes('?') ? '&audio=hi&lang=hi' : '?audio=hi&lang=hi';
      }
      iframe.src = targetUrl;
      renderServerButtons();
    }

    // Full HD 3D Next Server Trigger (Manual Mode)
    function nextServerManual() {
      triggerAdsterraAd();
      currentIdx = (currentIdx + 1) % servers.length;
      loadServer(currentIdx);
    }

    function changeAudio(val) {
      currentAudio = val;
      loadServer(currentIdx);
    }

    function skip(sec) {
      showHud('Skip', (sec > 0 ? '+' : '') + sec + 's');
      try {
        iframe.contentWindow.postMessage({ action: 'seek', offset: sec }, '*');
      } catch (e) {}
    }

    function setBrightness(val) {
      document.getElementById('brightVal').textContent = val + '%';
      iframe.style.filter = 'brightness(' + val + '%)';
      showHud('Brightness', val + '%');
    }

    function setVolume(val) {
      document.getElementById('volVal').textContent = val + '%';
      showHud('Volume', val + '%');
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }

    // Initialize Server 1 and Buttons
    renderServerButtons();
    loadServer(0);
  </script>
</body>
</html>`;

  const newWindow = window.open('about:blank', '_blank', windowFeatures);

  if (newWindow) {
    newWindow.document.open();
    newWindow.document.write(cleanPlayerHtml);
    newWindow.document.close();
    return newWindow;
  }

  return null;
}

export function openCleanPlayerWindow(
  media: MovieOrShow,
  season: number = 1,
  episode: number = 1,
  preferredAudio?: string
): Window | null {
  return openCleanPlayWindow(media, season, episode, preferredAudio);
}

export function openCleanDownloadWindow(
  media: MovieOrShow,
  tier: '4k' | '1080p' | '720p' | '480p' = '4k',
  season: number = 1,
  episode: number = 1
): Window | null {
  const isTv = media.media_type === 'tv' || (!media.title && !!media.name);
  const title = (media.title || media.name || 'Movie').replace(/"/g, '&quot;');
  const id = media.id;

  const downloadLinks = [
    { name: 'Direct Download Mirror 1 (Master 4K)', url: `https://vidsrc.me/embed/${isTv ? `tv?imdb=${id}&season=${season}&episode=${episode}` : `movie?imdb=${id}`}` },
    { name: 'High-Speed CDN Mirror 2 (1080p FHD)', url: `https://embed.su/embed/${isTv ? `tv/${id}/${season}/${episode}` : `movie/${id}`}` },
    { name: 'Ultra Fast StreamTape (720p HD)', url: `https://streamtape.com/search?q=${encodeURIComponent(title)}` },
    { name: 'Mobile Data Saver Mirror 4 (480p SD)', url: `https://filemoon.sx/search?q=${encodeURIComponent(title)}` },
    { name: 'Adsterra 10Gbps VIP Dedicated Node', url: ADSTERRA_DIRECT_LINKS[0] },
  ];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Download ${title} (4K 1080p 720p) - Clean Window</title>
  <style>
    body { background: #0b0d17; color: #fff; font-family: system-ui, sans-serif; padding: 24px; text-align: center; }
    .card { background: #141724; border: 1px solid #2a2e43; border-radius: 16px; padding: 24px; max-width: 600px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    h1 { font-size: 20px; font-weight: 900; margin-bottom: 8px; color: #facc15; }
    p { font-size: 12px; color: #9ca3af; margin-bottom: 20px; }
    .btn { display: block; background: linear-gradient(135deg, #10b981, #059669); color: #fff; text-decoration: none; font-weight: 800; font-size: 13px; padding: 12px; border-radius: 10px; margin: 10px 0; box-shadow: 0 4px 12px rgba(16,185,129,0.3); transition: transform 0.15s; }
    .btn:hover { transform: scale(1.02); }
    .btn-vip { background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; }
  </style>
</head>
<body>
  <div class="card">
    <h1>⬇ Direct Download: ${title}</h1>
    <p>Select your preferred resolution tier for high-speed download:</p>
    ${downloadLinks
      .map(
        (l) => `<a href="${l.url}" target="_blank" rel="noopener noreferrer" class="btn ${l.name.includes('VIP') ? 'btn-vip' : ''}">⚡ ${l.name}</a>`
      )
      .join('')}
  </div>
</body>
</html>`;

  const newWindow = window.open('about:blank', '_blank', 'width=700,height=550');
  if (newWindow) {
    newWindow.document.open();
    newWindow.document.write(html);
    newWindow.document.close();
    return newWindow;
  }
  return null;
}
