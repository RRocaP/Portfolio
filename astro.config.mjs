import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://RRocaP.github.io',
  base: '/Portfolio',
  output: 'static',
  integrations: [react(), tailwind({ applyBaseStyles: false })],
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'd3': ['d3'],
          },
        },
      },
    },
    ssr: {
      noExternal: ['d3'],
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
