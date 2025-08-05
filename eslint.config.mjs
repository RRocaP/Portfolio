import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        localStorage: 'readonly',
        navigator: 'readonly',
        history: 'readonly',
        location: 'readonly',
        fetch: 'readonly',
        
        // DOM types
        HTMLElement: 'readonly',
        HTMLCanvasElement: 'readonly',
        HTMLImageElement: 'readonly',
        SVGSVGElement: 'readonly',
        CustomEvent: 'readonly',
        MouseEvent: 'readonly',
        WheelEvent: 'readonly',
        Image: 'readonly',
        CanvasRenderingContext2D: 'readonly',
        
        // Browser APIs
        IntersectionObserver: 'readonly',
        ResizeObserver: 'readonly',
        Promise: 'readonly',
        
        // Node.js globals (for build tools)
        process: 'readonly',
        global: 'readonly',
        NodeJS: 'readonly',
        
        // Test globals
        vi: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        
        // Astro
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
      'no-eval': 'error',
      'no-implied-eval': 'error',
      
      // Code Quality
      'prefer-const': 'error',
      'no-var': 'error',
      'no-duplicate-imports': 'error',
      'no-useless-return': 'error',
      'no-unreachable': 'error',
      'eqeqeq': ['error', 'always'],
      'no-empty-function': 'warn',
      
      // TypeScript Specific (rules that don't require type information)
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      
      // Performance & Best Practices
      'prefer-arrow-callback': 'warn',
      'prefer-template': 'warn',
      'object-shorthand': 'warn'
    }
  },
  {
    // Disable linting for Astro files due to parsing complexities
    files: ['**/*.astro'],
    rules: {
      // Disable all rules for .astro files to avoid parsing errors
    },
    ignores: ['**/*.astro']
  },
  {
    files: ['**/*.{test,spec}.{js,ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-empty-function': 'off'
    }
  },
  {
    files: ['**/*.d.ts'],
    rules: {
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
      '*.config.{js,mjs,cjs,ts}',
      '**/*.astro'  // Skip Astro files entirely
    ]
  }
];