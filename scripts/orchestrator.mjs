#!/usr/bin/env node
// Local orchestration script (safe placeholder without Copilot CLI dependency)
import { execSync } from 'node:child_process';

function run(cmd) {
  try { console.log('> ' + cmd); execSync(cmd, { stdio: 'inherit' }); } catch (e) { console.log('Command failed (continuing):', cmd); }
}

console.log('Orchestration start');
run('npm run codegen:sdk');
run('npm run codegen:graphql');
run('npm run codegen:tests');
run('npm run test:types');
run('npm test');
console.log('Orchestration complete');
