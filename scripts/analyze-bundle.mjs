#!/usr/bin/env node
// Simple bundle analyzer: lists dist asset sizes
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
if(!fs.existsSync(dist)) { console.error('dist not found. Run build first.'); process.exit(1); }

function format(bytes){ if(bytes<1024) return bytes+' B'; const kb=bytes/1024; if(kb<1024) return kb.toFixed(1)+' KB'; return (kb/1024).toFixed(2)+' MB'; }

let total=0;
for (const file of fs.readdirSync(dist)) {
  const full = path.join(dist,file);
  const stat = fs.statSync(full);
  if (stat.isFile()) { total += stat.size; console.log(file.padEnd(50), format(stat.size)); }
}
console.log('\nTotal size:', format(total));
