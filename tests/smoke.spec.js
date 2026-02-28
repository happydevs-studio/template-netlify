import { test, expect } from '@playwright/test';

/**
 * Smoke Tests for Production/Staging Reliability
 * 
 * These tests verify critical functionality on live environments.
 * Run with: SMOKE_TEST_URL=https://your-site.netlify.app npm run test:smoke
 * 
 * Or via task: task reliability:smoke -- https://your-site.netlify.app
 */

// Get the target URL from environment variable or use default
const targetUrl = process.env.SMOKE_TEST_URL || process.env.BASE_URL || 'http://localhost:8080';

test.describe('Smoke Tests', () => {
  test.use({ baseURL: targetUrl });

  test('homepage loads successfully', async ({ page }) => {
    const response = await page.goto('/');
    
    // Verify successful response
    expect(response.status()).toBe(200);
    
    // Verify critical content loads
    await expect(page).toHaveTitle('Hello World');
  });

  test('page 2 loads successfully', async ({ page }) => {
    const response = await page.goto('/page2.html');
    
    expect(response.status()).toBe(200);
    await expect(page).toHaveTitle('Page 2');
  });

  test('page 3 loads successfully', async ({ page }) => {
    const response = await page.goto('/page3.html');
    
    expect(response.status()).toBe(200);
    await expect(page).toHaveTitle('Page 3');
  });

  test('basic navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Verify navigation elements exist
    const page2Link = page.locator('#nav-page2');
    const page3Link = page.locator('#nav-page3');
    
    await expect(page2Link).toBeVisible();
    await expect(page3Link).toBeVisible();
    
    // Test navigation to page 2
    await page2Link.click();
    await expect(page).toHaveURL(/.*page2.html/);
    await expect(page).toHaveTitle('Page 2');
  });

  test('static assets load correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check for CSS files
    const stylesheets = await page.locator('link[rel="stylesheet"]').count();
    expect(stylesheets).toBeGreaterThan(0);
    
    // Verify no console errors on load
    const errors = [];
    page.on('pageerror', error => errors.push(error));
    
    await page.waitForLoadState('networkidle');
    expect(errors.length).toBe(0);
  });

  test('site responds within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    const response = await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Ensure page loads within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    expect(response.status()).toBe(200);
  });

  test('all critical pages return 200 status', async ({ page }) => {
    const criticalPages = [
      '/',
      '/page2.html',
      '/page3.html'
    ];

    for (const pagePath of criticalPages) {
      const response = await page.goto(pagePath);
      expect(response.status(), `${pagePath} should return 200`).toBe(200);
    }
  });
});
