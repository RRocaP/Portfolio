import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const distDir = join(root, 'dist');
const commentRE = /<!--[\s\S]*?-->/g;

function walk(dir) {
  const entries = readdirSync(dir);
  for (const name of entries) {
    const full = join(dir, name);
    const s = statSync(full);
    if (s.isDirectory()) {
      walk(full);
    } else if (s.isFile() && name.endsWith('.html')) {
      const before = readFileSync(full, 'utf8');
      const after = before.replace(commentRE, '');
      if (after !== before) writeFileSync(full, after, 'utf8');
    }
  }
}

try {
  walk(distDir);
  console.log('[strip-html-comments] Processed dist HTML comments');
} catch (e) {
  console.error('[strip-html-comments] Failed:', e);
  process.exitCode = 1;
}

