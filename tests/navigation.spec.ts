import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('should navigate from home to features', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('SlopStopper');

    await page.click('#nav-features');
    await expect(page).toHaveURL(/.*features.html/);
    await expect(page).toHaveTitle('Features');
  });

  test('should navigate from home to tools', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('SlopStopper');

    await page.click('#nav-tools');
    await expect(page).toHaveURL(/.*tools.html/);
    await expect(page).toHaveTitle('Tools');
  });

  test('should navigate from features to tools', async ({ page }) => {
    await page.goto('/features.html');
    await expect(page).toHaveTitle('Features');

    await page.click('#nav-tools');
    await expect(page).toHaveURL(/.*tools.html/);
    await expect(page).toHaveTitle('Tools');
  });

  test('should navigate from tools to home', async ({ page }) => {
    await page.goto('/tools.html');
    await expect(page).toHaveTitle('Tools');

    await page.click('#nav-home');
    await expect(page).toHaveURL(/.*index.html/);
    await expect(page).toHaveTitle('SlopStopper');
  });

  test('should navigate through all pages in sequence', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('SlopStopper');

    await page.click('#nav-features');
    await expect(page).toHaveTitle('Features');

    await page.click('#nav-tools');
    await expect(page).toHaveTitle('Tools');

    await page.click('#nav-home');
    await expect(page).toHaveTitle('SlopStopper');
  });
});
