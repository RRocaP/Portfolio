/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,js,jsx,ts,tsx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        'background-alt': '#171717',
        'accent-red': '#DC2626',
        'accent-red-hover': '#EF4444',
      },
      animation: {
        'slow-drift': 'slow-drift 16s ease-in-out infinite',
        'slow-drift-2': 'slow-drift-2 18s ease-in-out infinite',
      },
      keyframes: {
        'slow-drift': {
          '0%': { transform: 'translate3d(0,0,0) rotate(0deg)' },
          '50%': { transform: 'translate3d(2vw,-1vh,0) rotate(-2deg)' },
          '100%': { transform: 'translate3d(0,0,0) rotate(0deg)' },
        },
        'slow-drift-2': {
          '0%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(-1vw,1vh,0)' },
          '100%': { transform: 'translate3d(0,0,0)' },
        },
      },
    },
  },
  plugins: [],
}

