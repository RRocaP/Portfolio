import { PurgeCSS } from 'purgecss';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const distDir = path.join(process.cwd(), 'dist');
const cssFiles = fs.readdirSync(path.join(distDir, '_assets')).filter(f => f.endsWith('.css')).map(f => path.join(distDir, '_assets', f));

async function optimize() {
  const content = ['./dist/**/*.html', './dist/**/*.js'];
  let originalBytes = 0;
  let optimizedBytes = 0;

  const purge = new PurgeCSS();
  for (const file of cssFiles) {
    const css = fs.readFileSync(file, 'utf8');
    originalBytes += Buffer.byteLength(css);
    const result = await purge.purge({ content, css: [{ raw: css }] });
    const optimizedCss = result[0].css;
    optimizedBytes += Buffer.byteLength(optimizedCss);
    fs.writeFileSync(file, optimizedCss);
  }

  const unusedBytes = originalBytes - optimizedBytes;
  const unusedPercent = originalBytes === 0 ? 0 : unusedBytes / originalBytes;

  // gzip size of final bundle
  let gzippedSize = 0;
  for (const file of cssFiles) {
    const gzip = zlib.gzipSync(fs.readFileSync(file));
    gzippedSize += gzip.length;
  }

  const report = {
    timestamp: new Date().toISOString(),
    originalBytes,
    optimizedBytes,
    unusedBytes,
    unusedPercent,
    gzippedSize
  };
  fs.writeFileSync('docs/performance/optimization-report.json', JSON.stringify(report, null, 2));
  console.log('CSS size (gzip):', (gzippedSize/1024).toFixed(2) + 'kB');
  console.log('Unused CSS:', unusedBytes, `(${(unusedPercent*100).toFixed(1)}%)`);

  const baselinePath = 'docs/performance/css-unused-baseline.json';
  if (fs.existsSync(baselinePath)) {
    const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
    if (unusedBytes > baseline.unusedBytes * 1.1) {
      console.error('Unused CSS increased beyond 10% of baseline');
      process.exit(1);
    }
  }
  fs.writeFileSync(baselinePath, JSON.stringify({ unusedBytes }, null, 2));
}

optimize();
