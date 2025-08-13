#!/usr/bin/env node
// Scans public/Portfolio/media for *-(480p|720p|1080p).webm and produces a JSON manifest
import fs from 'node:fs';
import path from 'node:path';

const mediaDir = path.resolve('public/Portfolio/media');
const outFile = path.resolve('public/Portfolio/media/manifest.json');

if (!fs.existsSync(mediaDir)) { console.error('Media dir missing'); process.exit(0); }

const groups = new Map();
for (const file of fs.readdirSync(mediaDir)) {
  const m = file.match(/^(.*)-(480p|720p|1080p)\.webm$/);
  if (!m) continue;
  const base = m[1];
  const quality = m[2];
  const entry = groups.get(base) || { base, sources: {} };
  entry.sources[quality] = `/Portfolio/media/${file}`;
  const poster = path.join(mediaDir, base + '-poster.jpg');
  if (fs.existsSync(poster)) entry.poster = `/Portfolio/media/${base}-poster.jpg`;
  groups.set(base, entry);
}

const manifest = { generatedAt: new Date().toISOString(), videos: [...groups.values()] };
fs.writeFileSync(outFile, JSON.stringify(manifest, null, 2));
console.log('Video manifest written to', outFile);
