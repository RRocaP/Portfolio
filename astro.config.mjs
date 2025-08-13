import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://RRocaP.github.io',
  base: '/Portfolio',
  output: 'static',
  integrations: [react(), tailwind({ applyBaseStyles: false })],
});
