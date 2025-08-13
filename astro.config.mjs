import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://rrocap.github.io',
  base: '/Portfolio',
  output: 'static',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    sitemap({ serialize(item){ return { ...item, changefreq: 'monthly', priority: 0.8 }; } })
  ],
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
