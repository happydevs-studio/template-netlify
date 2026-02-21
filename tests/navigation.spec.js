import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('should navigate from home to Code Quality page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Slop Protector');
    
    // Click on Code Quality link
    await page.click('#nav-page2');
    await expect(page).toHaveURL(/.*page2.html/);
    await expect(page).toHaveTitle('Code Quality');
  });

  test('should navigate from home to Testing & Docs page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Slop Protector');
    
    // Click on Testing & Docs link
    await page.click('#nav-page3');
    await expect(page).toHaveURL(/.*page3.html/);
    await expect(page).toHaveTitle('Testing & Docs');
  });

  test('should navigate from Code Quality to Testing & Docs', async ({ page }) => {
    await page.goto('/page2.html');
    await expect(page).toHaveTitle('Code Quality');
    
    // Click on Testing & Docs link
    await page.click('#nav-page3');
    await expect(page).toHaveURL(/.*page3.html/);
    await expect(page).toHaveTitle('Testing & Docs');
  });

  test('should navigate from Testing & Docs to home', async ({ page }) => {
    await page.goto('/page3.html');
    await expect(page).toHaveTitle('Testing & Docs');
    
    // Click on Home link
    await page.click('#nav-home');
    await expect(page).toHaveURL(/.*index.html/);
    await expect(page).toHaveTitle('Slop Protector');
  });

  test('should navigate through all pages in sequence', async ({ page }) => {
    // Start at home
    await page.goto('/');
    await expect(page).toHaveTitle('Slop Protector');
    
    // Navigate to Code Quality
    await page.click('#nav-page2');
    await expect(page).toHaveTitle('Code Quality');
    
    // Navigate to Testing & Docs
    await page.click('#nav-page3');
    await expect(page).toHaveTitle('Testing & Docs');
    
    // Navigate back to Home
    await page.click('#nav-home');
    await expect(page).toHaveTitle('Slop Protector');
  });
});

test.describe('Interactive Elements Tests', () => {
  test('home page button should activate slop shield', async ({ page }) => {
    await page.goto('/');
    
    // Click the button
    await page.click('#interactive-btn');
    
    // Check if message is displayed
    const message = await page.locator('#message').textContent();
    expect(message).toBe('Slop shield active! Your codebase is protected.');
  });

  test('Code Quality page input should audit package', async ({ page }) => {
    await page.goto('/page2.html');
    
    // Fill in the input
    await page.fill('#text-input', 'lodash');
    await page.click('#submit-btn');
    
    // Check if audit message is displayed
    const output = await page.locator('#output').textContent();
    expect(output).toBe('Auditing lodash... run npm audit for real results!');
  });

  test('Testing & Docs counter should increment and decrement', async ({ page }) => {
    await page.goto('/page3.html');
    
    // Check initial counter value
    let counter = await page.locator('#counter').textContent();
    expect(counter).toBe('0');
    
    // Increment
    await page.click('#increment-btn');
    counter = await page.locator('#counter').textContent();
    expect(counter).toBe('1');
    
    // Increment again
    await page.click('#increment-btn');
    counter = await page.locator('#counter').textContent();
    expect(counter).toBe('2');
    
    // Decrement
    await page.click('#decrement-btn');
    counter = await page.locator('#counter').textContent();
    expect(counter).toBe('1');
    
    // Reset
    await page.click('#reset-btn');
    counter = await page.locator('#counter').textContent();
    expect(counter).toBe('0');
  });
});

