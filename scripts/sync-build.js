import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const distAssetsDir = path.resolve(distDir, 'assets');
const rootAssetsDir = path.resolve(rootDir, 'assets');

console.log('🔄 Syncing build artifacts for GitHub Pages & Cloudflare Pages...');

// Ensure root assets directory exists
if (!fs.existsSync(rootAssetsDir)) {
  fs.mkdirSync(rootAssetsDir, { recursive: true });
}

// Copy dist/assets to root/assets so root index.html can load ./assets/index.js directly
if (fs.existsSync(distAssetsDir)) {
  const assetFiles = fs.readdirSync(distAssetsDir);
  for (const file of assetFiles) {
    const srcFile = path.join(distAssetsDir, file);
    const destFile = path.join(rootAssetsDir, file);
    fs.copyFileSync(srcFile, destFile);
  }
  console.log(`✅ Synced ${assetFiles.length} asset files to root /assets/`);
}

// Ensure .nojekyll in root and dist
fs.writeFileSync(path.join(rootDir, '.nojekyll'), '', 'utf8');
fs.writeFileSync(path.join(distDir, '.nojekyll'), '', 'utf8');

// Ensure 404.html in root and dist
const fourOhFourSrc = path.join(rootDir, 'public', '404.html');
if (fs.existsSync(fourOhFourSrc)) {
  fs.copyFileSync(fourOhFourSrc, path.join(rootDir, '404.html'));
  fs.copyFileSync(fourOhFourSrc, path.join(distDir, '404.html'));
}

// Ensure _redirects and _headers in root and dist
const redirectsSrc = path.join(rootDir, 'public', '_redirects');
if (fs.existsSync(redirectsSrc)) {
  fs.copyFileSync(redirectsSrc, path.join(rootDir, '_redirects'));
  fs.copyFileSync(redirectsSrc, path.join(distDir, '_redirects'));
}
const headersSrc = path.join(rootDir, 'public', '_headers');
if (fs.existsSync(headersSrc)) {
  fs.copyFileSync(headersSrc, path.join(rootDir, '_headers'));
  fs.copyFileSync(headersSrc, path.join(distDir, '_headers'));
}

console.log('🎉 Production build sync completed successfully!');
