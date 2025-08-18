import { defineConfig, loadEnv, type Plugin } from 'vite';
import { defineConfig as defineAstroConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { resolve } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { gzipSync, brotliCompressSync } from 'zlib';
import { fileURLToPath } from 'url';

// Environment-specific configuration
interface BuildConfig {
  minify: boolean;
  sourcemap: boolean | 'inline' | 'hidden';
  compression: boolean;
  budgets: {
    js: number;
    css: number;
    assets: number;
  };
  cdn?: string;
}

const buildConfigs: Record<string, BuildConfig> = {
  development: {
    minify: false,
    sourcemap: 'inline',
    compression: false,
    budgets: { js: 1000, css: 500, assets: 2000 }
  },
  staging: {
    minify: true,
    sourcemap: 'hidden',
    compression: true,
    budgets: { js: 300, css: 100, assets: 1000 }
  },
  production: {
    minify: true,
    sourcemap: false,
    compression: true,
    budgets: { js: 150, css: 50, assets: 500 },
    cdn: 'https://cdn.jsdelivr.net/npm'
  }
};

// Performance budget enforcement plugin
function performanceBudgetPlugin(): Plugin {
  return {
    name: 'performance-budget',
    writeBundle(options, bundle) {
      const env = process.env.NODE_ENV || 'development';
      const config = buildConfigs[env];
      
      if (!config) return;

      let jsSize = 0;
      let cssSize = 0;
      let assetSize = 0;
      const violations: string[] = [];

      Object.entries(bundle).forEach(([fileName, chunk]) => {
        if ('code' in chunk) {
          const size = Buffer.byteLength(chunk.code, 'utf8') / 1024; // KB
          
          if (fileName.endsWith('.js')) {
            jsSize += size;
          } else if (fileName.endsWith('.css')) {
            cssSize += size;
          }
        } else if ('source' in chunk) {
          const size = Buffer.byteLength(chunk.source as string, 'utf8') / 1024;
          assetSize += size;
        }
      });

      // Check budgets
      if (jsSize > config.budgets.js) {
        violations.push(`JavaScript bundle size ${jsSize.toFixed(1)}KB exceeds budget of ${config.budgets.js}KB`);
      }
      if (cssSize > config.budgets.css) {
        violations.push(`CSS bundle size ${cssSize.toFixed(1)}KB exceeds budget of ${config.budgets.css}KB`);
      }
      if (assetSize > config.budgets.assets) {
        violations.push(`Assets size ${assetSize.toFixed(1)}KB exceeds budget of ${config.budgets.assets}KB`);
      }

      if (violations.length > 0) {
        console.error('\n=¨ Performance Budget Violations:');
        violations.forEach(violation => console.error(`  - ${violation}`));
        
        if (env === 'production') {
          throw new Error('Build failed due to performance budget violations');
        }
      } else {
        console.log('\n Performance budgets passed:');
        console.log(`  - JS: ${jsSize.toFixed(1)}KB/${config.budgets.js}KB`);
        console.log(`  - CSS: ${cssSize.toFixed(1)}KB/${config.budgets.css}KB`);
        console.log(`  - Assets: ${assetSize.toFixed(1)}KB/${config.budgets.assets}KB`);
      }
    }
  };
}

// Compression plugin for gzip and brotli
function compressionPlugin(): Plugin {
  return {
    name: 'compression',
    writeBundle(options, bundle) {
      const env = process.env.NODE_ENV || 'development';
      const config = buildConfigs[env];
      
      if (!config.compression) return;

      Object.entries(bundle).forEach(([fileName, chunk]) => {
        if ('code' in chunk) {
          const content = chunk.code;
          const outputDir = options.dir || 'dist';
          const filePath = resolve(outputDir, fileName);
          
          // Create gzip version
          const gzipped = gzipSync(content);
          writeFileSync(`${filePath}.gz`, gzipped);
          
          // Create brotli version
          const brotlied = brotliCompressSync(content);
          writeFileSync(`${filePath}.br`, brotlied);
          
          console.log(`=æ Compressed: ${fileName} (gzip: ${gzipped.length}B, br: ${brotlied.length}B)`);
        }
      });
    }
  };
}

// Bundle analyzer plugin
function bundleAnalyzerPlugin(): Plugin {
  return {
    name: 'bundle-analyzer',
    writeBundle(options, bundle) {
      const analysis = {
        timestamp: new Date().toISOString(),
        bundles: {} as Record<string, any>,
        totalSize: 0,
        chunkCount: 0
      };

      Object.entries(bundle).forEach(([fileName, chunk]) => {
        let size = 0;
        let type = 'unknown';

        if ('code' in chunk) {
          size = Buffer.byteLength(chunk.code, 'utf8');
          type = fileName.endsWith('.js') ? 'javascript' : 'stylesheet';
        } else if ('source' in chunk) {
          size = Buffer.byteLength(chunk.source as string, 'utf8');
          type = 'asset';
        }

        analysis.bundles[fileName] = {
          size,
          type,
          dependencies: 'modules' in chunk ? Object.keys(chunk.modules || {}) : []
        };

        analysis.totalSize += size;
        analysis.chunkCount++;
      });

      // Write analysis report
      const outputDir = options.dir || 'dist';
      writeFileSync(
        resolve(outputDir, 'bundle-analysis.json'),
        JSON.stringify(analysis, null, 2)
      );

      console.log(`\n=Ê Bundle Analysis:`);
      console.log(`  - Total size: ${(analysis.totalSize / 1024).toFixed(1)}KB`);
      console.log(`  - Chunks: ${analysis.chunkCount}`);
      console.log(`  - Report: ${outputDir}/bundle-analysis.json`);
    }
  };
}

// CDN rewriter plugin
function cdnPlugin(cdnUrl?: string): Plugin {
  return {
    name: 'cdn-rewriter',
    generateBundle(options, bundle) {
      if (!cdnUrl) return;

      // Rewrite asset URLs to use CDN
      Object.entries(bundle).forEach(([fileName, chunk]) => {
        if ('code' in chunk) {
          chunk.code = chunk.code.replace(
            /(?<=["'])\.\/assets\/([^"']+)(?=["'])/g,
            `${cdnUrl}/assets/$1`
          );
        }
      });
    }
  };
}

// Environment variables validation
function validateEnvironment(mode: string) {
  const requiredVars = ['NODE_ENV'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.warn(`   Missing environment variables: ${missing.join(', ')}`);
  }
}

export default defineConfig(({ command, mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  validateEnvironment(mode);
  
  const buildConfig = buildConfigs[mode] || buildConfigs.development;
  const isProduction = mode === 'production';
  const isDevelopment = mode === 'development';

  return defineAstroConfig({
    site: 'https://rrocap.github.io',
    base: '/Portfolio',
    output: 'static',
    
    integrations: [
      react(),
      tailwind({ applyBaseStyles: false }),
      sitemap({ 
        serialize(item) { 
          return { 
            ...item, 
            changefreq: 'monthly', 
            priority: 0.8 
          }; 
        } 
      })
    ],
    
    vite: {
      define: {
        __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
        __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
        __MODE__: JSON.stringify(mode),
      },
      
      plugins: [
        performanceBudgetPlugin(),
        ...(buildConfig.compression ? [compressionPlugin()] : []),
        bundleAnalyzerPlugin(),
        cdnPlugin(buildConfig.cdn),
      ],
      
      build: {
        target: ['es2022', 'edge88', 'firefox78', 'chrome87', 'safari13'],
        minify: buildConfig.minify ? 'terser' : false,
        sourcemap: buildConfig.sourcemap,
        cssCodeSplit: true,
        
        terserOptions: isProduction ? {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug'],
            passes: 2,
          },
          mangle: {
            safari10: true,
          },
        } : undefined,
        
        rollupOptions: {
          output: {
            manualChunks: (id: string) => {
              // Vendor chunks
              if (id.includes('node_modules')) {
                if (id.includes('react') || id.includes('react-dom')) {
                  return 'vendor-react';
                }
                if (id.includes('d3')) {
                  return 'vendor-d3';
                }
                if (id.includes('gsap')) {
                  return 'vendor-gsap';
                }
                if (id.includes('fuse.js')) {
                  return 'vendor-search';
                }
                return 'vendor-other';
              }
              
              // Feature chunks
              if (id.includes('/components/')) {
                if (id.includes('Hero') || id.includes('ThreeBackground')) {
                  return 'features-hero';
                }
                if (id.includes('Project') || id.includes('Showcase')) {
                  return 'features-projects';
                }
                if (id.includes('Contact') || id.includes('Form')) {
                  return 'features-contact';
                }
                if (id.includes('Search') || id.includes('Navigation')) {
                  return 'features-navigation';
                }
                if (id.includes('Timeline') || id.includes('Skills')) {
                  return 'features-timeline';
                }
                if (id.includes('Blog') || id.includes('Testimonials')) {
                  return 'features-content';
                }
                return 'features-common';
              }
              
              // Utility chunks
              if (id.includes('/utils/')) {
                if (id.includes('animation') || id.includes('gsap')) {
                  return 'utils-animation';
                }
                if (id.includes('performance') || id.includes('analytics')) {
                  return 'utils-monitoring';
                }
                if (id.includes('seo') || id.includes('theme')) {
                  return 'utils-ui';
                }
                return 'utils-core';
              }
              
              return undefined;
            },
            
            // Asset naming with hashing for cache busting
            assetFileNames: (assetInfo) => {
              const info = assetInfo.name!.split('.');
              const ext = info[info.length - 1];
              
              if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif)$/i.test(assetInfo.name!)) {
                return `assets/images/[name]${isProduction ? '-[hash]' : ''}[extname]`;
              }
              if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name!)) {
                return `assets/fonts/[name]${isProduction ? '-[hash]' : ''}[extname]`;
              }
              
              return `assets/[name]${isProduction ? '-[hash]' : ''}[extname]`;
            },
            
            chunkFileNames: `assets/js/[name]${isProduction ? '-[hash]' : ''}.js`,
            entryFileNames: `assets/js/[name]${isProduction ? '-[hash]' : ''}.js`,
          },
          
          // External dependencies (CDN)
          ...(isProduction && {
            external: [],
          }),
        },
        
        // Asset size warnings
        chunkSizeWarningLimit: 500,
        assetsInlineLimit: 4096, // 4KB limit for inlining
      },
      
      css: {
        preprocessorOptions: {
          css: {
            charset: false,
          },
        },
        postcss: {
          plugins: [
            require('autoprefixer'),
            ...(isProduction ? [
              require('cssnano')({
                preset: ['default', {
                  discardComments: { removeAll: true },
                  normalizeWhitespace: true,
                  colormin: true,
                  convertValues: true,
                  minifyFontValues: true,
                  minifySelectors: true,
                }]
              })
            ] : []),
          ],
        },
      },
      
      server: {
        port: 4321,
        host: true,
        cors: true,
        hmr: {
          overlay: true,
        },
      },
      
      preview: {
        port: 4322,
        host: true,
      },
      
      optimizeDeps: {
        include: ['react', 'react-dom', 'd3', 'gsap', 'fuse.js', 'zod'],
        exclude: ['@astrojs/react'],
        esbuildOptions: {
          target: 'es2022',
        },
      },
      
      // SSR configuration
      ssr: {
        noExternal: ['d3', 'gsap'],
      },
      
      // Worker configuration
      worker: {
        format: 'es',
        rollupOptions: {
          output: {
            format: 'es',
            entryFileNames: 'assets/workers/[name]-[hash].js',
          },
        },
      },
      
      // Experimental features
      experimental: {
        renderBuiltUrl(filename: string, { hostType }: { hostType: 'js' | 'css' | 'html' }) {
          if (buildConfig.cdn && (hostType === 'js' || hostType === 'css')) {
            return `${buildConfig.cdn}/${filename}`;
          }
          return filename;
        },
      },
    },
    
    build: {
      inlineStylesheets: 'auto',
      assets: 'assets',
    },
    
    // Image optimization
    image: {
      service: {
        entrypoint: 'astro/assets/services/sharp',
        config: {
          limitInputPixels: 268402689, // 16384 x 16384
        },
      },
    },
    
    // Prefetch configuration
    prefetch: {
      prefetchAll: false,
      defaultStrategy: 'viewport',
    },
  });
});

// Export build configurations for external tooling
export { buildConfigs };