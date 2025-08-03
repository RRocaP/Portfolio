import { PurgeCSS } from 'purgecss';
import { readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';
import { gzipSync } from 'zlib';

const purgeCSSConfig = {
  content: ['./dist/**/*.html', './dist/**/*.js'],
  css: ['./dist/**/*.css'],
  safelist: { standard: [/^astro-/], deep: [], greedy: [] },
};

const baselineFile = './dist-sizes.json';

function parseSize(input) {
  return input.endsWith('kB') ? parseFloat(input) * 1024 : parseFloat(input);
}

function formatSize(bytes) {
  return `${(bytes / 1024).toFixed(2)}kB`;
}

async function getFiles(dir, ext) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const res = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await getFiles(res, ext));
    else if (res.endsWith(ext)) files.push(res);
  }
  return files;
}

async function optimize() {
  console.log('🎯 Starting CSS optimization...');
  try {
    await new PurgeCSS().purge(purgeCSSConfig);

    const cssFiles = await getFiles('./dist', '.css');
    const htmlFiles = await getFiles('./dist', '.html');
    let total = 0;
    for (const file of cssFiles) {
      const css = await readFile(file);
      total += gzipSync(css).length;
    }
    for (const file of htmlFiles) {
      const html = await readFile(file, 'utf8');
      const matches = html.match(/<style[^>]*>([^<]*)<\/style>/g) || [];
      for (const m of matches) {
        const css = m.replace(/<style[^>]*>|<\/style>/g, '');
        total += gzipSync(Buffer.from(css)).length;
      }
    }

    const baseline = JSON.parse(await readFile(baselineFile, 'utf8'));
    const previous = parseSize(baseline.bundleSize.css.gzipped);
    const growth = ((total - previous) / previous) * 100;
    if (growth > 10) {
      console.error(`❌ CSS bundle grew by ${growth.toFixed(1)}%`);
      process.exit(1);
    }

    baseline.bundleSize.css.gzipped = formatSize(total);
    baseline.timestamp = new Date().toISOString();
    await writeFile(baselineFile, JSON.stringify(baseline, null, 2));

    const report = { timestamp: baseline.timestamp, cssGzipped: baseline.bundleSize.css.gzipped };
    await writeFile('./dist/optimization-report.json', JSON.stringify(report, null, 2));
    console.log(`📊 CSS size: ${baseline.bundleSize.css.gzipped}`);
    console.log('✅ Optimization complete');
  } catch (err) {
    console.error('❌ Optimization failed:', err);
    process.exit(1);
  }
}

optimize();
