import js from '@eslint/js';
import astroEslintParser from 'eslint-plugin-astro';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        requestAnimationFrame: 'readonly',
        localStorage: 'readonly',
        HTMLElement: 'readonly',
        CustomEvent: 'readonly',
        IntersectionObserver: 'readonly',
        Promise: 'readonly',
        Astro: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off'
    }
  },
  {
    ignores: ['dist/**', 'node_modules/**', '.astro/**']
  }
];