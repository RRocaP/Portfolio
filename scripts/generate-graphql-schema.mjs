#!/usr/bin/env node
// Generate GraphQL schema from existing data (simplified)
import fs from 'node:fs';
import path from 'node:path';
import { publications } from '../src/data/publications.js';

const typeDefs = `# Auto-generated minimal schema\n type Publication {\n  title: String!\n  year: String!\n  journal: String!\n  url: String!\n  featured: Boolean\n }\n type Query { publications(featured: Boolean): [Publication!]! }`;

const resolvers = `export const resolvers = {\n  Query: {\n    publications: (_: any, args: { featured?: boolean }) => {\n      return args.featured == null ? publications : publications.filter(p => !!p.featured === args.featured);\n    }\n  }\n};`;

const outDir = path.resolve('src/graphql');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'schema.graphql'), typeDefs, 'utf-8');
fs.writeFileSync(path.join(outDir, 'resolvers.ts'), resolvers, 'utf-8');
console.log('GraphQL schema generated at src/graphql/');
