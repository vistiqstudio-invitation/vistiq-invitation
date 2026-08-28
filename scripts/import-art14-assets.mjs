// Imports only the media assets authorized by the project owner, not third-party application code.
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const exec = promisify(execFile);
import path from 'node:path';
const [htmlPath, cssPath, fontsPath] = process.argv.slice(2);
if (!htmlPath || !cssPath || !fontsPath) throw new Error('Usage: node scripts/import-art14-assets.mjs <reference.html> <reference.css> <fonts.css>');
const source = readFileSync(htmlPath, 'utf8') + readFileSync(cssPath, 'utf8');
const urls = [...new Set(source.match(/https:\/\/web\.menujuacara\.id\/wp-content\/uploads\/[^\s"'<>\\)]+/g))]
  .filter(url => /\/(nadiah-yusuf-|azurah-adika-|DLLADE|della-ade-|bismillah-png)/.test(url) && /\.(png|jpe?g)$/.test(url))
  .filter(url => !/-\d+x\d+\./.test(url));
const dir = 'public/themes/luxury-art-white-garden';
mkdirSync(dir, { recursive: true });
let index = 0;
async function worker() {
  while (index < urls.length) {
    const url = urls[index++];
    const file = path.join(dir, path.basename(url));
    if (existsSync(file)) continue;
    try { await exec('curl', ['-fsSL', '--max-time', '40', '--retry', '1', url, '-o', file]); console.log(path.basename(file)); }
    catch { console.error('FAILED', url); process.exitCode = 1; }
  }
}
await Promise.all(Array.from({length: 6}, worker));
const fonts = readFileSync(fontsPath, 'utf8');
for (const block of fonts.match(/@font-face\s*\{[^}]+\}/g) || []) {
  const family = block.match(/font-family: '([^']+)'/)?.[1];
  const weight = block.match(/font-weight: (\d+)/)?.[1];
  const style = block.match(/font-style: (\w+)/)?.[1];
  const url = block.match(/url\(([^)]+)\)/)?.[1];
  if (url) await exec('curl', ['-fsSL', '--max-time', '40', url, '-o', path.join(dir, `${family.replaceAll(' ', '-')}-${weight}-${style}.ttf`)]);
}
const music = source.match(/https:\/\/web\.menujuacara\.id\/wp-content\/uploads\/[^"'<>\s]+\.mp3/)?.[0];
if (music) await exec('curl', ['-fsSL', '--max-time', '60', encodeURI(music), '-o', path.join(dir, 'reference-music.mp3')]);
