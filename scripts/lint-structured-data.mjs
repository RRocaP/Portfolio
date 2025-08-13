#!/usr/bin/env node
// Lints built HTML in dist/ for required structured data & i18n elements
// Checks:
// 1. <html lang> matches locale segment (en|es|ca) for localized routes
// 2. Presence of Person JSON-LD on root locale landing pages
// 3. Presence of ScholarlyArticle JSON-LD on research detail pages
// 4. Canonical + hreflang link consistency (basic existence test)

import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
if (!fs.existsSync(dist)) {
  console.error('dist/ not found. Run build first.');
  process.exit(1);
}

const LOCALES = ['en','es','ca'];
let errors = 0;
let pagesChecked = 0;

function read(file){ return fs.readFileSync(file,'utf-8'); }

function extractJsonLd(html){
  const blocks = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g;
  let m; while((m = re.exec(html))){
    try { blocks.push(JSON.parse(m[1])); } catch { /* ignore parse error */ }
  }
  return blocks;
}

function listHtml(dir){
  const out = [];
  for (const e of fs.readdirSync(dir)) {
    const full = path.join(dir,e);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) out.push(...listHtml(full));
    else if (e.endsWith('.html')) out.push(full);
  }
  return out;
}

const htmlFiles = listHtml(dist);

for (const file of htmlFiles) {
  const rel = path.relative(dist, file);
  const html = read(file);
  pagesChecked++;

  // 1. lang
  // Try html lang; if missing, fallback to WebSite JSON-LD inLanguage field
  let lang;
  const htmlLang = html.match(/<html[^>]*lang=["']([^"']+)["']/i);
  if (htmlLang) lang = htmlLang[1];
  if (!lang) {
    // attempt to parse WebSite JSON-LD
    try {
      const ldBlocks = extractJsonLd(html);
      const site = ldBlocks.find(b => b['@type'] === 'WebSite' && typeof b.inLanguage === 'string');
      if (site) lang = site.inLanguage;
    } catch {}
  }
  const seg = rel.split(path.sep)[0];
  if (LOCALES.includes(seg)) {
    if (lang !== seg) {
      console.error(`Lang mismatch: ${rel} has lang='${lang}' expected '${seg}'`);
      errors++;
    }
  }

  // Extract JSON-LD
  const jsonLd = extractJsonLd(html);
  const types = new Set(jsonLd.map(b => b['@type']));

  const isLocaleIndex = /^(en|es|ca)\/(index.html)$/.test(rel) || rel === 'index.html';
  if (isLocaleIndex) {
    const hasPerson = jsonLd.some(b => b['@type'] === 'Person');
    if (!hasPerson) { console.error(`Missing Person JSON-LD on ${rel}`); errors++; }
  }

  const isResearch = /research\//.test(rel);
  if (isResearch) {
    if (![...types].some(t => t === 'ScholarlyArticle')) {
      console.error(`Missing ScholarlyArticle JSON-LD on ${rel}`);
      errors++;
    }
  }

  // Canonical + hreflang basic presence
  if (!/rel=["']canonical["']/.test(html)) {
    console.error(`Missing canonical link on ${rel}`);
    errors++;
  }
  // Only require a minimal hreflang presence on localized pages
  if (LOCALES.some(l => rel.startsWith(l+'/'))) {
    if (!/hreflang="en"/.test(html)) {
      console.error(`Missing hreflang links (expected at least en) on ${rel}`);
      errors++;
    }
  }
}

if (errors) {
  console.error(`Structured data lint failed: ${errors} issue(s) across ${pagesChecked} page(s).`);
  process.exit(1);
} else {
  console.log(`Structured data lint passed: ${pagesChecked} pages ok.`);
}
