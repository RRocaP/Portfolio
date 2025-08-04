import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'test-results/html-report' }],
    ['json', { outputFile: 'test-results/test-results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['line'],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.CI ? 'http://localhost:4321' : 'http://localhost:4321',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Video recording */
    video: 'retain-on-failure',
    
    /* Timeout for each action */
    actionTimeout: 10000,
    
    /* Timeout for navigation */
    navigationTimeout: 30000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // Desktop browsers
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Enable modern CSS features
        ignoreHTTPSErrors: true,
      },
      dependencies: ['setup'],
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        ignoreHTTPSErrors: true,
      },
      dependencies: ['setup'],
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        ignoreHTTPSErrors: true,
      },
      dependencies: ['setup'],
    },

    // Mobile devices
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
        ignoreHTTPSErrors: true,
      },
      dependencies: ['setup'],
    },
    
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 12'],
        ignoreHTTPSErrors: true,
      },
      dependencies: ['setup'],
    },

    // Tablet devices
    {
      name: 'tablet-chrome',
      use: { 
        ...devices['iPad Pro'],
        ignoreHTTPSErrors: true,
      },
      dependencies: ['setup'],
    },

    // Accessibility testing project
    {
      name: 'accessibility',
      use: { 
        ...devices['Desktop Chrome'],
        ignoreHTTPSErrors: true,
      },
      testMatch: /.*\.accessibility\.spec\.ts/,
      dependencies: ['setup'],
    },

    // Performance testing project
    {
      name: 'performance',
      use: { 
        ...devices['Desktop Chrome'],
        ignoreHTTPSErrors: true,
      },
      testMatch: /.*\.performance\.spec\.ts/,
      dependencies: ['setup'],
    },

    // Visual regression testing project
    {
      name: 'visual',
      use: { 
        ...devices['Desktop Chrome'],
        ignoreHTTPSErrors: true,
      },
      testMatch: /.*\.visual\.spec\.ts/,
      dependencies: ['setup'],
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run build && npm run preview',
    port: 4321,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  /* Global test timeout */
  timeout: 60000,

  /* Expect timeout */
  expect: {
    // Maximum time expect() should wait for the condition to be met
    timeout: 10000,
    
    // Threshold for screenshot comparisons
    threshold: 0.2,
    
    // Animation handling for visual tests
    toHaveScreenshot: {
      mode: 'css',
      animations: 'disabled',
    },
    
    toMatchSnapshot: {
      mode: 'css',
      animations: 'disabled',
    },
  },

  /* Output directory for test artifacts */
  outputDir: 'test-results/',
});