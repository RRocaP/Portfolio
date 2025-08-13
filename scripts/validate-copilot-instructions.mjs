#!/usr/bin/env node
// Validates presence & key sections of .copilot/instructions.md before deployment.
import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('.copilot/instructions.md');
if (!fs.existsSync(file)) {
  console.error('[copilot-validate] Missing .copilot/instructions.md');
  process.exit(1);
}
const md = fs.readFileSync(file, 'utf-8');

// Required substrings / headings to enforce baseline audit contract
const required = [
  '## Copilot Instructions for RRocaP Portfolio',
  'PRIORITIES (strict order):',
  '## Project Context',
  '## Code Style Guidelines',
  '## Specific Patterns & Components',
  '## Deployment',
  '## What NOT To Do',
  '## Quick Commands',
  '## Assistance Protocol'
];

const missing = required.filter(r => !md.includes(r));
if (missing.length) {
  console.error('[copilot-validate] Missing required sections:', missing.join(', '));
  process.exit(1);
}

// Simple sanity lint: warn if file size < 1KB (unexpected truncation)
if (md.length < 800) {
  console.warn('[copilot-validate] WARNING: instructions.md unusually small; verify content.');
}

console.log('[copilot-validate] Copilot instructions validated successfully.');
