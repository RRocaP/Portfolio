import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import astroEslintParser from 'eslint-plugin-astro';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parser: tsparser,
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
        Astro: 'readonly',
        globalThis: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      // Error Prevention
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      
      // Code Quality
      'prefer-const': 'error',
      'no-var': 'error',
      'no-duplicate-imports': 'error',
      'no-useless-return': 'error',
      'no-unreachable': 'error',
      'consistent-return': 'warn',
      'default-case': 'warn',
      'eqeqeq': ['error', 'always'],
      'guard-for-in': 'error',
      'no-else-return': 'warn',
      'no-empty-function': 'warn',
      'no-magic-numbers': ['warn', { 
        ignore: [-1, 0, 1, 2],
        ignoreArrayIndexes: true,
        enforceConst: true
      }],
      
      // TypeScript Specific
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      
      // Performance & Best Practices
      'no-loop-func': 'error',
      'no-new-object': 'error',
      'no-new-wrappers': 'error',
      'prefer-arrow-callback': 'warn',
      'prefer-template': 'warn',
      'object-shorthand': 'warn',
      
      // Accessibility
      'no-accesskey': 'error'
    }
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroEslintParser,
      parserOptions: {
        parser: tsparser,
        extraFileExtensions: ['.astro']
      }
    },
    rules: {
      'astro/no-conflict-set-directives': 'error',
      'astro/no-unused-define-vars-in-style': 'error'
    }
  },
  {
    files: ['**/*.{test,spec}.{js,ts,tsx}'],
    rules: {
      'no-magic-numbers': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.astro/**',
      'coverage/**',
      'build/**',
      '*.config.{js,mjs,cjs,ts}'
    ]
  }
];