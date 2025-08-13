#!/usr/bin/env node
// Compares latest metrics to previous snapshot & raises regression notice / issue
import fs from 'node:fs';
import path from 'node:path';

const latestPath = path.resolve('metrics/metrics-latest.json');
if (!fs.existsSync(latestPath)) { console.log('No latest metrics found; skipping regression check.'); process.exit(0); }
const latest = JSON.parse(fs.readFileSync(latestPath,'utf-8'));
const prevPath = path.resolve('metrics/metrics-prev.json');
let prev = null;
if (fs.existsSync(prevPath)) prev = JSON.parse(fs.readFileSync(prevPath,'utf-8'));

const regressions = [];
if (prev) {
  function deltaKb(key){ return (latest.sizes[key]-prev.sizes[key])/1024; }
  const scriptDelta = deltaKb('script');
  if (scriptDelta > 20) regressions.push(`Script size increased by ${scriptDelta.toFixed(1)}KB`);
  const totalDelta = deltaKb('total');
  if (totalDelta > 50) regressions.push(`Total asset size increased by ${totalDelta.toFixed(1)}KB`);
}

if (!prev) {
  fs.writeFileSync(prevPath, JSON.stringify(latest, null, 2));
  console.log('Baseline metrics stored (no previous snapshot).');
  process.exit(0);
}

if (regressions.length === 0) {
  console.log('No regressions detected. Updating baseline.');
  fs.writeFileSync(prevPath, JSON.stringify(latest, null, 2));
  process.exit(0);
}

console.warn('Regressions detected:\n'+regressions.map(r=>' - '+r).join('\n'));
fs.writeFileSync('metrics/REGRESSION.md', `# Performance Regressions\n\n${regressions.map(r=>`* ${r}`).join('\n')}\n\nTimestamp: ${latest.timestamp}`);

// Attempt issue creation if GITHUB_TOKEN & repo context available
const { GITHUB_TOKEN, GITHUB_REPOSITORY } = process.env;
if (GITHUB_TOKEN && GITHUB_REPOSITORY) {
  const [owner, repo] = GITHUB_REPOSITORY.split('/');
  const body = {
    title: 'Automated Performance Regression',
    body: `Detected regressions on ${latest.timestamp}:\n\n${regressions.map(r=>`- ${r}`).join('\n')}\n\nSnapshot:\n\n\`\n${JSON.stringify(latest,null,2)}\n\``
  };
  fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}`, 'Accept':'application/vnd.github+json' },
    body: JSON.stringify(body)
  }).then(r => {
    if (!r.ok) console.error('Issue creation failed', r.status);
    else console.log('Regression issue created');
  }).catch(e => console.error('Issue creation error', e));
}

// Do not fail build; informational
process.exit(0);
