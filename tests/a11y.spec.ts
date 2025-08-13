
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = [
  '/',
  '/en/research/functional-inclusion-bodies',
  '/es',
  '/es/research/functional-inclusion-bodies',
  '/ca',
  '/ca/research/functional-inclusion-bodies',
];

const axeCoreScript = fs.readFileSync(path.resolve(__dirname, '../node_modules/axe-core/axe.min.js'), 'utf-8');

test.describe('Accessibility Audits', () => {
  for (const route of routes) {
    test(`should not have any automatically detectable accessibility issues on ${route}`, async ({ page }) => {
      await page.goto(route);
      await page.evaluate(axeCoreScript);

      const accessibilityScanResults = await page.evaluate(() => axe.run());

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});
