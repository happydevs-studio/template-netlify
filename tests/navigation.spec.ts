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

test.describe('Interactive Elements Tests', () => {
  test('home page button should display health check message', async ({ page }) => {
    await page.goto('/');

    await page.click('#interactive-btn');

    const message = await page.locator('#message').textContent();
    expect(message).toBe('✅ Repo is healthy!');
  });

  test('features page input should confirm feature is enabled', async ({ page }) => {
    await page.goto('/features.html');

    await page.fill('#text-input', 'SAST');
    await page.click('#submit-btn');

    const output = await page.locator('#output').textContent();
    expect(output).toBe("Feature 'SAST' is enabled!");
  });

  test('tools page counter should increment and decrement', async ({ page }) => {
    await page.goto('/tools.html');

    let counter = await page.locator('#counter').textContent();
    expect(counter).toBe('0');

    await page.click('#increment-btn');
    counter = await page.locator('#counter').textContent();
    expect(counter).toBe('1');

    await page.click('#increment-btn');
    counter = await page.locator('#counter').textContent();
    expect(counter).toBe('2');

    await page.click('#decrement-btn');
    counter = await page.locator('#counter').textContent();
    expect(counter).toBe('1');

    await page.click('#reset-btn');
    counter = await page.locator('#counter').textContent();
    expect(counter).toBe('0');
  });
});
