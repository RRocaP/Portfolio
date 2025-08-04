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
      target: 'es2020',
      minify: 'esbuild',
      cssMinify: true,
      rollupOptions: {
        treeshake: {
          moduleSideEffects: false
        },
        output: {
          manualChunks: id => {
            // Create small, focused chunks for better caching
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('d3-')) {
                return 'vendor-d3';
              }
              // Group other vendor libs together  
              return 'vendor-misc';
            }

            // Only include heavy D3 components if they're actually imported
            if (id.includes('AntimicrobialResistanceTimeline')) {
              return 'viz-timeline';
            }
            if (id.includes('ProteinEngineering')) {
              return 'viz-protein';
            }
            if (id.includes('GeneTherapyVisualization')) {
              return 'viz-gene-therapy';
            }
            if (id.includes('ResearchImpactDashboard')) {
              return 'viz-research-impact';
            }
            
            // Simple components stay in main bundle
            if (id.includes('SimpleTimeline')) {
              return null; // Main bundle
            }

            // Separate chunk for lazy loading components
            if (id.includes('LazyVisualization')) {
              return 'lazy-viz';
            }

            // Default chunk for other application code
            return null;
          },
        },
        external: id => {
          // Don't externalize anything for now - keep as is
          return false;
        }
      },
      assetsInlineLimit: 4096, // Inline small assets to reduce HTTP requests
    },
    define: {
      // Ensure React is built in production mode
      'process.env.NODE_ENV': '"production"'
    },
  },
});
