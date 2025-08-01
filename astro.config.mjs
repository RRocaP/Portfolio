import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://rrocap.github.io',
  base: '/Portfolio',
  integrations: [
    tailwind({
      applyBaseStyles: false,
      nesting: true,
    }),
    mdx(),
    sitemap(),
  ],
  build: {
    inlineStylesheets: 'auto',
    assets: '_assets',
  },
  vite: {
    build: {
      cssMinify: 'lightningcss',
      rollupOptions: {
        output: {
          assetFileNames: '_assets/[name].[hash][extname]',
          chunkFileNames: '_chunks/[name].[hash].js',
          entryFileNames: '_entry/[name].[hash].js',
        },
      },
    },
    css: {
      transformer: 'lightningcss',
      lightningcss: {
        targets: {
          chrome: 90,
          firefox: 88,
          safari: 14,
        },
      },
    },
    ssr: {
      noExternal: ['@fontsource/*'],
    },
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false,
      },
    },
  },
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});