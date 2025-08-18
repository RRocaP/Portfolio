module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:4321/en/',
        'http://localhost:4321/es/', 
        'http://localhost:4321/ca/'
      ],
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local:.*:4321',
      startServerReadyTimeout: 30000,
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'categories:pwa': ['warn', { minScore: 0.8 }],
        
        // Performance budgets
        'resource-summary:script:size': ['error', { maxNumericValue: 153600 }], // 150KB
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 51200 }], // 50KB
        'resource-summary:image:size': ['warn', { maxNumericValue: 1048576 }], // 1MB
        'resource-summary:total:size': ['warn', { maxNumericValue: 2097152 }], // 2MB
        
        // Core Web Vitals
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 200 }],
        
        // Accessibility
        'color-contrast': 'error',
        'heading-order': 'error',
        'html-has-lang': 'error',
        'html-lang-valid': 'error',
        'image-alt': 'error',
        'label': 'error',
        'link-name': 'error',
        
        // Best practices
        'uses-https': 'error',
        'is-on-https': 'error',
        'uses-responsive-images': 'warn',
        'efficient-animated-content': 'warn',
        'modern-image-formats': 'warn',
        
        // SEO
        'meta-description': 'error',
        'document-title': 'error',
        'hreflang': 'warn',
        'canonical': 'warn',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};