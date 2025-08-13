#!/usr/bin/env node
// Generates a lightweight TS SDK from data structures (placeholder)
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('src/sdk');
fs.mkdirSync(outDir, { recursive: true });

const content = `// Auto-generated SDK (skeleton)\nexport interface Publication { title: string; year: string; journal: string; url: string; featured?: boolean; }\nexport class PublicationsAPI {\n  constructor(private base = ''){}\n  async list(): Promise<Publication[]> {\n    const mod = await import('../data/publications.js');\n    return mod.publications;\n  }\n}`;

fs.writeFileSync(path.join(outDir, 'publications.ts'), content, 'utf-8');
console.log('SDK generated at src/sdk/publications.ts');
