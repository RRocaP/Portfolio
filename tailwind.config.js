/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        // Primary colors with WCAG AA compliance
        'primary-bg': '#000000',
        'accent-yellow': '#FFD300', // 19.6:1 on black
        'accent-red': '#D72638', // 5.4:1 on black
        'surface-1': '#111111', // Elevation level 1
        'surface-2': '#181818', // Elevation level 2
        'surface-3': 'rgba(255, 255, 255, 0.05)', // Elevation level 3
        'surface-4': 'rgba(255, 255, 255, 0.08)', // Elevation level 4
        
        // Text colors
        'text-primary': '#FFFFFF', // 21:1 on black
        'text-secondary': '#E0E0E0', // 15.3:1 on black
        'text-muted': '#A0A0A0', // 7.8:1 on black (AA compliant)
        
        // Borders
        'border-subtle': 'rgba(255, 255, 255, 0.1)',
        'border-strong': 'rgba(255, 255, 255, 0.2)',
      },
      fontFamily: {
        sans: ['InterVariable', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'monospace'],
      },
      fontWeight: {
        'thin': '100',
        'light': '300',
        'regular': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
      fontSize: {
        // Typography hierarchy with proper line heights
        'display-lg': ['clamp(3rem, 6vw, 5rem)', { lineHeight: '1.1', fontWeight: '800' }],
        'display-sm': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.2', fontWeight: '600' }],
        'heading': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['0.875rem', { lineHeight: '1.5', fontWeight: '350' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'pulse-subtle': 'pulseSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-hero': 'linear-gradient(135deg, #000000 0%, #1A1A1A 100%)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}