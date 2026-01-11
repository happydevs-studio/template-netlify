import { test, expect } from '@playwright/test';

test.describe('Pet Insurance Form Tests', () => {
  test('should load pet insurance form page', async ({ page }) => {
    await page.goto('/pet-insurance.html');
    await expect(page).toHaveTitle('Pet Insurance - Get Your Quote');
    
    // Check if main heading is visible
    await expect(page.locator('h1')).toHaveText('Pet Insurance');
  });

  test('should navigate to pet insurance from home page', async ({ page }) => {
    await page.goto('/');
    
    // Click on Pet Insurance link
    await page.click('#nav-pet-insurance');
    await expect(page).toHaveURL(/.*pet-insurance.html/);
    await expect(page).toHaveTitle('Pet Insurance - Get Your Quote');
  });

  test('should have all required form sections', async ({ page }) => {
    await page.goto('/pet-insurance.html');
    
    // Check for section headings
    await expect(page.locator('h2:has-text("Tell us about your pet")')).toBeVisible();
    await expect(page.locator('h2:has-text("Choose your coverage")')).toBeVisible();
    await expect(page.locator('h2:has-text("Your contact details")')).toBeVisible();
  });

  test('should fill out complete form', async ({ page }) => {
    await page.goto('/pet-insurance.html');
    
    // Fill pet information
    await page.fill('input[name="petName"]', 'Buddy');
    await page.check('input[value="dog"]');
    await page.fill('input[name="breed"]', 'Labrador');
    await page.fill('input[name="age"]', '5');
    
    // Select coverage
    await page.check('input[value="premium"]');
    await page.check('input[value="dental"]');
    await page.check('input[value="emergency"]');
    
    // Fill contact details
    await page.fill('input[name="ownerName"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="phone"]', '5551234567');
    await page.fill('input[name="zipCode"]', '12345');
    
    // Verify all fields are filled
    await expect(page.locator('input[name="petName"]')).toHaveValue('Buddy');
    await expect(page.locator('input[name="email"]')).toHaveValue('john@example.com');
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/pet-insurance.html');
    
    // Try to submit without filling required fields
    await page.click('button[type="submit"]');
    
    // Form should not submit (browser validation should prevent it)
    // Check that we're still on the same page
    await expect(page).toHaveURL(/.*pet-insurance.html/);
  });

  test('should navigate back to home', async ({ page }) => {
    await page.goto('/pet-insurance.html');
    
    // Click back to home link
    await page.click('text=← Back to Home');
    await expect(page).toHaveURL(/.*index.html/);
    await expect(page).toHaveTitle('Hello World');
  });
});
