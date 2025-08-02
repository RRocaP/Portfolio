/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    colors: {
      // Design System - Bold Dark Red Palette
      'primary-bg': '#2B0000',
      'surface-1': '#400000', 
      'surface-2': '#600000',
      'accent-yellow': '#FFD300',
      'on-accent-text': '#000000',
      'body-text': '#F3F3F3',
      'text-muted': '#B8B8B8',
      'border': '#600000',
      // System colors
      'white': '#ffffff',
      'black': '#000000',
      'transparent': 'transparent',
      'current': 'currentColor',
    },
    fontFamily: {
      body: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
      heading: ['Playfair Display Variable', 'Playfair Display', 'serif'],
      sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
      serif: ['Playfair Display Variable', 'Playfair Display', 'serif'],
    },
    fontSize: {
      'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      'display-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      'heading-xl': ['2rem', { lineHeight: '1.3' }],
      'heading-lg': ['1.75rem', { lineHeight: '1.3' }],
      'heading-md': ['1.5rem', { lineHeight: '1.4' }],
      'heading-sm': ['1.25rem', { lineHeight: '1.4' }],
      'body-xl': ['1.25rem', { lineHeight: '1.6' }],
      'body-lg': ['1.125rem', { lineHeight: '1.6' }],
      'body-md': ['1rem', { lineHeight: '1.6' }],
      'body-sm': ['0.875rem', { lineHeight: '1.5' }],
    },
    maxWidth: {
      'container': '1280px',
      'prose': '75ch',
      'prose-narrow': '45ch',
    },
    extend: {
      gridTemplateColumns: {
        '12': 'repeat(12, minmax(0, 1fr))',
      },
      gridColumn: {
        'span-1': 'span 1 / span 1',
        'span-2': 'span 2 / span 2',
        'span-3': 'span 3 / span 3',
        'span-4': 'span 4 / span 4',
        'span-5': 'span 5 / span 5',
        'span-6': 'span 6 / span 6',
        'span-7': 'span 7 / span 7',
        'span-8': 'span 8 / span 8',
        'span-9': 'span 9 / span 9',
        'span-10': 'span 10 / span 10',
        'span-11': 'span 11 / span 11',
        'span-12': 'span 12 / span 12',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(2rem)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    function({ addUtilities, addComponents }) {
      // Utility classes
      addUtilities({
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.text-justify': {
          'text-align': 'justify',
        },
        '.focus-ring': {
          '@apply focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:ring-offset-2 focus:ring-offset-primary-bg': {},
        },
        '.skip-link': {
          '@apply sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-yellow focus:text-on-accent-text focus:rounded focus:font-medium': {},
        },
      });

      // Component classes
      addComponents({
        '.container-12': {
          '@apply w-full max-w-container mx-auto px-4 sm:px-6 lg:px-8': {},
        },
        '.grid-12': {
          '@apply grid grid-cols-12 gap-4 lg:gap-6': {},
        },
        '.card': {
          '@apply bg-surface-1 border border-border rounded-lg p-6': {},
        },
        '.btn-primary': {
          '@apply bg-accent-yellow text-on-accent-text px-4 py-2 rounded font-medium hover:bg-yellow-400 transition-colors focus-ring': {},
        },
        '.btn-secondary': {
          '@apply bg-surface-1 text-body-text border border-border px-4 py-2 rounded font-medium hover:bg-surface-2 transition-colors focus-ring': {},
        },
      });
    },
  ],
};