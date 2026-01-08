import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('should navigate from home to page 2', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('The X-Files');
    
    // Click on Page 2 link
    await page.click('#nav-page2');
    await expect(page).toHaveURL(/.*page2.html/);
    await expect(page).toHaveTitle('X-Files Agents');
  });

  test('should navigate from home to page 3', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('The X-Files');
    
    // Click on Page 3 link
    await page.click('#nav-page3');
    await expect(page).toHaveURL(/.*page3.html/);
    await expect(page).toHaveTitle('X-Files Cases');
  });

  test('should navigate from page 2 to page 3', async ({ page }) => {
    await page.goto('/page2.html');
    await expect(page).toHaveTitle('X-Files Agents');
    
    // Click on Page 3 link
    await page.click('#nav-page3');
    await expect(page).toHaveURL(/.*page3.html/);
    await expect(page).toHaveTitle('X-Files Cases');
  });

  test('should navigate from page 3 to home', async ({ page }) => {
    await page.goto('/page3.html');
    await expect(page).toHaveTitle('X-Files Cases');
    
    // Click on Home link
    await page.click('#nav-home');
    await expect(page).toHaveURL(/.*index.html/);
    await expect(page).toHaveTitle('The X-Files');
  });

  test('should navigate through all pages in sequence', async ({ page }) => {
    // Start at home
    await page.goto('/');
    await expect(page).toHaveTitle('The X-Files');
    
    // Navigate to Page 2
    await page.click('#nav-page2');
    await expect(page).toHaveTitle('X-Files Agents');
    
    // Navigate to Page 3
    await page.click('#nav-page3');
    await expect(page).toHaveTitle('X-Files Cases');
    
    // Navigate back to Home
    await page.click('#nav-home');
    await expect(page).toHaveTitle('The X-Files');
  });
});

test.describe('Interactive Elements Tests', () => {
  test('home page button should display message', async ({ page }) => {
    await page.goto('/');
    
    // Click the button
    await page.click('#interactive-btn');
    
    // Check if message is displayed
    const message = await page.locator('#message').textContent();
    expect(message).toBe('I Want To Believe');
  });

  test('page 2 input should greet user', async ({ page }) => {
    await page.goto('/page2.html');
    
    // Fill in the input
    await page.fill('#text-input', 'Alice');
    await page.click('#submit-btn');
    
    // Check if greeting is displayed
    const output = await page.locator('#output').textContent();
    expect(output).toBe('Welcome, Agent Alice. Access granted.');
  });

  test('page 3 counter should increment and decrement', async ({ page }) => {
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
