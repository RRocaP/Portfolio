#!/usr/bin/env node
// Reads budgets.json and enforces simple asset size & count budgets against dist/ output
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
if (!fs.existsSync(dist)) { console.error('dist/ not found. Run build first.'); process.exit(1); }

const budgetsFile = path.resolve('budgets.json');
if (!fs.existsSync(budgetsFile)) { console.error('budgets.json missing'); process.exit(1); }
const budgets = JSON.parse(fs.readFileSync(budgetsFile,'utf-8'));
const active = budgets[0]; // single path level budget

const sizeBudgets = Object.fromEntries(active.resourceSizes.map(r => [r.resourceType, r.budget * 1024])); // KB -> bytes
const countBudgets = Object.fromEntries(active.resourceCounts.map(r => [r.resourceType, r.budget]));

const exts = {
  script: ['.js'],
  stylesheet: ['.css'],
  image: ['.png','.jpg','.jpeg','.webp','.avif','.svg'],
  font: ['.woff','.woff2','.ttf','.otf']
};

const totals = { script:0, stylesheet:0, image:0, font:0, total:0 };
const counts = { script:0, stylesheet:0, font:0 };

function walk(dir){
  for (const e of fs.readdirSync(dir)) {
    const full = path.join(dir,e);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full); else {
      const ext = path.extname(e).toLowerCase();
      for (const type of Object.keys(exts)) {
        if (exts[type].includes(ext)) {
          totals[type]+=st.size; totals.total+=st.size;
          if (counts[type] != null) counts[type]++;
          break;
        }
      }
    }
  }
}
walk(dist);

let errors=0;
function kb(b){ return (b/1024).toFixed(1); }
for (const [type, limit] of Object.entries(sizeBudgets)) {
  if (totals[type] > limit) {
    console.error(`Size budget exceeded for ${type}: ${kb(totals[type])}KB > ${(limit/1024)}KB`);
    errors++;
  }
}
for (const [type, limit] of Object.entries(countBudgets)) {
  if (counts[type] > limit) {
    console.error(`Count budget exceeded for ${type}: ${counts[type]} > ${limit}`);
    errors++;
  }
}

// Write metrics snapshot
fs.mkdirSync('metrics', { recursive: true });
const snapshot = {
  timestamp: new Date().toISOString(),
  sizes: Object.fromEntries(Object.entries(totals).map(([k,v]) => [k, v] )),
  counts
};
fs.writeFileSync('metrics/metrics-latest.json', JSON.stringify(snapshot, null, 2));
fs.appendFileSync('metrics/metrics-log.jsonl', JSON.stringify(snapshot)+'\n');

if (errors) { console.error(`Budget check failed with ${errors} issue(s).`); process.exit(1); }
console.log('Budgets OK');
