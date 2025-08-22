export default {
  plugins: {
    // CSS nesting support
    'postcss-nested': {},
    
    // Autoprefixer for vendor prefixes
    autoprefixer: {},
    
    // CSS custom properties optimization
    'postcss-custom-properties': {
      preserve: false
    },
    
    // Production optimizations
    ...(process.env.NODE_ENV === 'production' && {
      // Remove unused CSS
      '@fullhuman/postcss-purgecss': {
        content: [
          './index.html',
          './assets/js/**/*.js'
        ],
        safelist: [
          // GSAP animation classes
          /^gsap-/,
          // Dynamic theme classes
          /^light$/,
          /^dark$/,
          // Animation states
          /^active$/,
          /^in-progress$/,
          /^completed$/
        ]
      },
      
      // CSS minification
      cssnano: {
        preset: ['advanced', {
          discardComments: {
            removeAll: true
          },
          reduceIdents: false,
          zindex: false
        }]
      }
    })
  }
};