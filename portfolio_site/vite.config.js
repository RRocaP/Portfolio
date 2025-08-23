import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'
import legacy from '@vitejs/plugin-legacy'
import { VitePWA } from 'vite-plugin-pwa'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import WebfontDownload from 'vite-plugin-webfont-dl'

export default defineConfig(({ command, mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '')
  
  const isProduction = mode === 'production'
  const isAnalyze = mode === 'analyze'
  const isStaging = mode === 'staging'

  return {
    // Base public path - set to repo name for GitHub Pages
    base: mode === 'production' ? '/Portfolio/' : '/',
    
    // Build configuration
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: isProduction ? false : true,
      minify: 'terser',
      target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
      
      // Advanced minification options
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
          pure_funcs: isProduction ? ['console.log', 'console.warn'] : [],
          passes: 2
        },
        mangle: {
          safari10: true
        },
        format: {
          comments: false
        }
      },
      
      // Rollup options for advanced optimization
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html')
        },
        
        output: {
          // Advanced chunking strategy
          manualChunks: (id) => {
            // Vendor chunk for CDN libraries (GSAP)
            if (id.includes('gsap') || id.includes('cdnjs')) {
              return 'vendor-animations'
            }
            
            // Core utilities
            if (id.includes('utils') || id.includes('helpers')) {
              return 'utils'
            }
            
            // Main application code
            if (id.includes('assets/js/app.js')) {
              return 'app'
            }
            
            // Node modules vendor chunk
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          },
          
          // Optimized file naming for long-term caching
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
            if (facadeModuleId) {
              const name = facadeModuleId.split('/').pop()?.replace(/\\.js$/, '')
              return `assets/js/[name]-[hash].js`
            }
            return `assets/js/[name]-[hash].js`
          },
          
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.')
            const ext = info[info.length - 1]
            
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `assets/images/[name]-[hash][extname]`
            }
            
            if (/css/i.test(ext)) {
              return `assets/css/[name]-[hash][extname]`
            }
            
            if (/woff2?|eot|ttf|otf/i.test(ext)) {
              return `assets/fonts/[name]-[hash][extname]`
            }
            
            return `assets/[name]-[hash][extname]`
          }
        },
        
        // External dependencies (CDN resources)
        external: isProduction ? [] : []
      },
      
      // CSS code splitting
      cssCodeSplit: true,
      
      // Report compressed file sizes
      reportCompressedSize: true,
      
      // Chunk size warning limit
      chunkSizeWarningLimit: 1000
    },
    
    // CSS preprocessing
    css: {
      modules: false,
      postcss: {
        plugins: []
      },
      // Use default CSS processor for now
      // transformer: 'lightningcss',
      // lightningcss: {
      //   minify: isProduction,
      //   targets: {
      //     chrome: 87,
      //     firefox: 78,
      //     safari: 14,
      //     edge: 88
      //   }
      // }
    },
    
    // Development server configuration
    server: {
      port: 3000,
      host: true,
      open: true,
      hmr: {
        overlay: true
      },
      // Proxy for development API calls if needed
      proxy: {}
    },
    
    // Preview server configuration
    preview: {
      port: 3000,
      host: true,
      open: true
    },
    
    // Plugins
    plugins: [
      // Download and optimize web fonts
      WebfontDownload([
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap'
      ]),
      
      // Legacy browser support (disabled for now)
      // legacy({
      //   targets: ['defaults', 'not IE 11'],
      //   additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      //   modernPolyfills: ['es.object.has-own'],
      //   renderLegacyChunks: isProduction
      // }),
      
      // Compression plugins
      ...(isProduction ? [
        // Gzip compression
        viteCompression({
          algorithm: 'gzip',
          ext: '.gz',
          threshold: 1024,
          compressionOptions: {
            level: 9
          }
        }),
        
        // Brotli compression
        viteCompression({
          algorithm: 'brotliCompress',
          ext: '.br',
          threshold: 1024,
          compressionOptions: {
            level: 11
          }
        })
      ] : []),
      
      // Bundle analyzer
      ...(isAnalyze ? [
        visualizer({
          filename: 'dist/bundle-analysis.html',
          open: true,
          gzipSize: true,
          brotliSize: true
        })
      ] : []),
      
      // Progressive Web App
      false && VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,pdf}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheKeyWillBeUsed: async ({ request }) => {
                  return `${request.url}?v=1`
                }
              }
            },
            {
              urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'cdnjs-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                }
              }
            }
          ]
        },
        manifest: {
          name: 'Ramon Roca-Pinilla Portfolio',
          short_name: 'Portfolio',
          description: 'Biotech and data tools portfolio',
          theme_color: '#7dd3fc',
          background_color: '#0c0d10',
          display: 'standalone',
          icons: [
            {
              src: '/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    
    // Optimize dependencies
    optimizeDeps: {
      include: [],
      exclude: ['gsap']
    },
    
    // Define global constants
    define: {
      __DEV__: !isProduction,
      __PROD__: isProduction,
      __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0')
    },
    
    // Enable esbuild for faster builds
    esbuild: {
      drop: isProduction ? ['console', 'debugger'] : [],
      legalComments: 'none'
    }
  }
})