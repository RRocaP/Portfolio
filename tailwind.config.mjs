/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,js,jsx,ts,tsx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        'bg-base': '#080B11',
        'bg-surface': '#0E1219',
        'bg-elevated': '#141A24',
        background: '#080B11',
        'background-alt': '#0E1219',
        'accent-red': '#DA291C',
        'accent-warm': '#C4956A',
        'accent-yellow': '#D4A843',
        'accent-green': '#4ADE80',
      },
      fontFamily: {
        display: ['"Source Serif 4"', 'Georgia', '"Times New Roman"', 'serif'],
        body: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
}
