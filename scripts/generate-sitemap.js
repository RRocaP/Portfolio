// Sitemap generator for Ramon Roca Pinilla Portfolio
// Generates XML sitemap for better SEO

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://rrocap.github.io/Portfolio';

// Define all pages with their metadata
const pages = [
  {
    url: '/',
    changefreq: 'monthly',
    priority: '1.0',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/en/',
    changefreq: 'monthly', 
    priority: '1.0',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/es/',
    changefreq: 'monthly',
    priority: '0.9',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/ca/',
    changefreq: 'monthly',
    priority: '0.9', 
    lastmod: new Date().toISOString().split('T')[0]
  }
];

// Generate XML sitemap
function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${generateHreflangs()}
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
}

// Generate hreflang links for multilingual SEO
function generateHreflangs() {
  const languages = [
    { code: 'en', url: '/en/' },
    { code: 'es', url: '/es/' },
    { code: 'ca', url: '/ca/' },
    { code: 'x-default', url: '/en/' }
  ];

  return languages.map(lang => 
    `<xhtml:link rel="alternate" hreflang="${lang.code}" href="${baseUrl}${lang.url}"/>`
  ).join('\n    ');
}

// Generate robots.txt
function generateRobotsTxt() {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Optimize crawling
Crawl-delay: 1

# Block access to source maps and config files
Disallow: /*.map$
Disallow: /astro.config.*
Disallow: /package*.json
Disallow: /tsconfig.json
Disallow: /.eslintrc.*
Disallow: /.prettierrc.*

# Allow specific assets
Allow: /favicon.svg
Allow: /manifest.json
Allow: /sw.js
Allow: /profile.jpg
`;
}

// Write files
function writeSitemapFiles() {
  const publicDir = path.join(__dirname, '../public');
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write sitemap.xml
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  const sitemapContent = generateSitemap();
  fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
  console.log('✅ Generated sitemap.xml');

  // Write robots.txt
  const robotsPath = path.join(publicDir, 'robots.txt');
  const robotsContent = generateRobotsTxt();
  fs.writeFileSync(robotsPath, robotsContent, 'utf8');
  console.log('✅ Generated robots.txt');

  // Log file sizes
  const sitemapSize = fs.statSync(sitemapPath).size;
  const robotsSize = fs.statSync(robotsPath).size;
  
  console.log(`📊 Sitemap size: ${sitemapSize} bytes`);
  console.log(`📊 Robots.txt size: ${robotsSize} bytes`);
  console.log(`🌐 Sitemap URL: ${baseUrl}/sitemap.xml`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    writeSitemapFiles();
    console.log('🎉 Sitemap generation completed successfully!');
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

export { generateSitemap, generateRobotsTxt, writeSitemapFiles };