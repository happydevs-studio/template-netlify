import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('should navigate from home to page 2', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Pet Insurance Application');
    
    // Click on Page 2 link
    await page.click('#nav-page2');
    await expect(page).toHaveURL(/.*page2.html/);
    await expect(page).toHaveTitle('Page 2');
  });

  test('should navigate from home to page 3', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Pet Insurance Application');
    
    // Click on Page 3 link
    await page.click('#nav-page3');
    await expect(page).toHaveURL(/.*page3.html/);
    await expect(page).toHaveTitle('Page 3');
  });

  test('should navigate from page 2 to page 3', async ({ page }) => {
    await page.goto('/page2.html');
    await expect(page).toHaveTitle('Page 2');
    
    // Click on Page 3 link
    await page.click('#nav-page3');
    await expect(page).toHaveURL(/.*page3.html/);
    await expect(page).toHaveTitle('Page 3');
  });

  test('should navigate from page 3 to home', async ({ page }) => {
    await page.goto('/page3.html');
    await expect(page).toHaveTitle('Page 3');
    
    // Click on Home link
    await page.click('#nav-home');
    await expect(page).toHaveURL(/.*index.html/);
    await expect(page).toHaveTitle('Pet Insurance Application');
  });

  test('should navigate through all pages in sequence', async ({ page }) => {
    // Start at home
    await page.goto('/');
    await expect(page).toHaveTitle('Pet Insurance Application');
    
    // Navigate to Page 2
    await page.click('#nav-page2');
    await expect(page).toHaveTitle('Page 2');
    
    // Navigate to Page 3
    await page.click('#nav-page3');
    await expect(page).toHaveTitle('Page 3');
    
    // Navigate back to Home
    await page.click('#nav-home');
    await expect(page).toHaveTitle('Pet Insurance Application');
  });
});

test.describe('Interactive Elements Tests', () => {
  test('home page form should submit successfully', async ({ page }) => {
    await page.goto('/');
    
    // Fill in the form
    await page.fill('#pet-name', 'Fluffy');
    await page.selectOption('#pet-type', 'cat');
    await page.fill('#pet-age', '3');
    await page.fill('#pet-breed', 'Persian');
    await page.fill('#owner-name', 'John Doe');
    await page.fill('#owner-email', 'john@example.com');
    await page.fill('#owner-phone', '555-1234');
    await page.selectOption('#coverage-level', 'standard');
    
    // Submit the form
    await page.click('#interactive-btn');
    
    // Check if success message is displayed
    const message = await page.locator('#message').textContent();
    expect(message).toContain('Thank you! Application submitted for Fluffy');
    expect(message).toContain('john@example.com');
  });

  test('page 2 input should greet user', async ({ page }) => {
    await page.goto('/page2.html');
    
    // Fill in the input
    await page.fill('#text-input', 'Alice');
    await page.click('#submit-btn');
    
    // Check if greeting is displayed
    const output = await page.locator('#output').textContent();
    expect(output).toBe('Hello, Alice! Welcome to Page 2!');
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
