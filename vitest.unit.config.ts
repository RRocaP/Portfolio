import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
    exclude: ['src/stories/**/*', '**/*.stories.{js,ts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        'storybook-static/',
        '.storybook/',
        'src/stories/',
        '**/*.stories.{js,ts,jsx,tsx}',
        'src/types/',
        'src/env.d.ts',
        'vitest.config.ts',
        'vitest.setup.ts',
        'vitest.unit.config.ts',
        'astro.config.mjs',
        'tailwind.config.js',
        'postcss.config.cjs',
        'eslint.config.mjs',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});