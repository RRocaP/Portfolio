import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';

// Extend basic test by providing fixtures
export const test = base.extend<{
  homePage: HomePage;
}>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
});

export { expect };