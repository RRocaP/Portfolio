import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  
  // Launch a browser to warm up the server
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Wait for the dev server to be ready
    console.log('Waiting for dev server to be ready...');
    await page.goto(baseURL || 'http://localhost:4321', { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    
    // Warm up critical pages
    const criticalPages = ['/en/', '/es/', '/ca/'];
    
    for (const path of criticalPages) {
      try {
        await page.goto(`${baseURL}${path}`, { 
          waitUntil: 'networkidle',
          timeout: 30000 
        });
        console.log(`Warmed up: ${path}`);
      } catch (error) {
        console.warn(`Failed to warm up ${path}:`, error);
      }
    }
    
    console.log('Global setup complete');
  } catch (error) {
    console.error('Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;