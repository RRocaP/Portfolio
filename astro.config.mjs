import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { compression } from 'vite-plugin-compression2';

export default defineConfig({
  site: 'https://RRocaP.github.io',
  base: '/Portfolio',
  output: 'static',
  integrations: [react()],
  vite: {
    plugins: [
      // Gzip compression - widely supported
      compression({
        algorithm: 'gzip',
        exclude: [/\.(br)$/, /\.(gz)$/],
        threshold: 1024, // Only compress files larger than 1KB
        compressionOptions: {
          level: 6, // Good balance between compression ratio and speed
        },
        skipIfLargerOrEqual: true, // Skip if compressed size >= original
      }),
      // Brotli compression - better compression ratio for modern browsers
      compression({
        algorithm: 'brotliCompress',
        exclude: [/\.(br)$/, /\.(gz)$/],
        threshold: 1024, // Only compress files larger than 1KB
        compressionOptions: {
          level: 6, // Good balance between compression ratio and speed
        },
        skipIfLargerOrEqual: true, // Skip if compressed size >= original
      }),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: id => {
            // Vendor chunks - stable dependencies that rarely change
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('d3')) {
                return 'vendor-d3';
              }
              // Group other vendor libs together
              return 'vendor-misc';
            }

            // Feature-based chunks for better caching
            if (
              id.includes('Timeline') ||
              id.includes('AntimicrobialResistance')
            ) {
              return 'feature-timeline';
            }
            if (
              id.includes('Protein') &&
              (id.includes('Visualization') || id.includes('Engineering'))
            ) {
              return 'feature-protein';
            }
            if (id.includes('GeneTherapy')) {
              return 'feature-gene-therapy';
            }

            // Default chunk for other application code
            return null;
          },
        },
      },
    },
  },
});
