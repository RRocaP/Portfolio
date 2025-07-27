import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://RRocaP.github.io',
  base: '/Portfolio',
  output: 'static',
  integrations: [react()],
});