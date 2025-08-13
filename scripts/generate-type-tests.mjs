#!/usr/bin/env node
// Naive test generation scanning src/types for exported type aliases/interfaces and creating placeholder asserts.
import fs from 'node:fs';
import path from 'node:path';

const typesDir = path.resolve('src/types');
const outDir = path.resolve('tests/generated');
fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(typesDir).filter(f => f.endsWith('.ts'));
const tests = [];
for (const file of files) {
  const full = path.join(typesDir, file);
  const code = fs.readFileSync(full,'utf-8');
  const exports = [...code.matchAll(/export\s+(?:interface|type)\s+(\w+)/g)].map(m => m[1]);
  if (!exports.length) continue;
  const testFile = path.join(outDir, file.replace('.ts','.test.ts'));
  const content = `// Auto-generated tests for ${file}\nimport * as Types from '../../src/types/${file}';\n// Placeholder runtime shape checks\n${exports.map(e => `// expect Type ${e} to be defined\nif (!Object.prototype.hasOwnProperty.call(Types, '${e}')) throw new Error('Missing export: ${e}');`).join('\n')}\n`; 
  fs.writeFileSync(testFile, content, 'utf-8');
  tests.push(testFile);
}
console.log('Generated test files:', tests.length);
