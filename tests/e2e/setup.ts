import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('do setup', async ({ page }) => {
  // Perform any global setup needed for tests
  
  // Navigate to the homepage to ensure the application is running
  await page.goto('/');
  
  // Wait for the page to be fully loaded
  await page.waitForLoadState('networkidle');
  
  // Verify the application is working
  await expect(page.locator('h1')).toBeVisible();
  
  // Check if there are any critical JavaScript errors
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  
  // Wait a bit to catch any immediate errors
  await page.waitForTimeout(2000);
  
  // Log any critical errors but don't fail setup unless they're severe
  if (errors.length > 0) {
    console.log('JavaScript errors detected during setup:', errors);
    
    // Only fail if there are critical errors that would break tests
    const criticalErrors = errors.filter(error => 
      error.includes('ReferenceError') || 
      error.includes('TypeError') ||
      error.includes('SyntaxError')
    );
    
    if (criticalErrors.length > 0) {
      throw new Error(`Critical JavaScript errors detected: ${criticalErrors.join(', ')}`);
    }
  }
  
  console.log('✅ Setup completed successfully');
});