import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('should navigate from home to history page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Exercise Logger');
    
    // Click on History link
    await page.click('#nav-page2');
    await expect(page).toHaveURL(/.*page2.html/);
    await expect(page).toHaveTitle('Exercise History');
  });

  test('should navigate from home to statistics page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Exercise Logger');
    
    // Click on Statistics link
    await page.click('#nav-page3');
    await expect(page).toHaveURL(/.*page3.html/);
    await expect(page).toHaveTitle('Exercise Statistics');
  });

  test('should navigate from history to statistics page', async ({ page }) => {
    await page.goto('/page2.html');
    await expect(page).toHaveTitle('Exercise History');
    
    // Click on Statistics link
    await page.click('#nav-page3');
    await expect(page).toHaveURL(/.*page3.html/);
    await expect(page).toHaveTitle('Exercise Statistics');
  });

  test('should navigate from statistics to home', async ({ page }) => {
    await page.goto('/page3.html');
    await expect(page).toHaveTitle('Exercise Statistics');
    
    // Click on Add Exercise link
    await page.click('#nav-home');
    await expect(page).toHaveURL(/.*index.html/);
    await expect(page).toHaveTitle('Exercise Logger');
  });

  test('should navigate through all pages in sequence', async ({ page }) => {
    // Start at home
    await page.goto('/');
    await expect(page).toHaveTitle('Exercise Logger');
    
    // Navigate to History
    await page.click('#nav-page2');
    await expect(page).toHaveTitle('Exercise History');
    
    // Navigate to Statistics
    await page.click('#nav-page3');
    await expect(page).toHaveTitle('Exercise Statistics');
    
    // Navigate back to Home
    await page.click('#nav-home');
    await expect(page).toHaveTitle('Exercise Logger');
  });
});

test.describe('Exercise Logger Tests', () => {
  // Clear localStorage before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should add an exercise and show success message', async ({ page }) => {
    await page.goto('/');
    
    // Fill in the form
    await page.fill('#exercise-name', 'Running');
    await page.selectOption('#exercise-type', 'Cardio');
    await page.fill('#exercise-duration', '30');
    
    // Submit the form
    await page.click('#interactive-btn');
    
    // Check if success message is displayed
    const message = await page.locator('#message').textContent();
    expect(message).toBe('Exercise logged successfully!');
  });

  test('should display exercises in history page', async ({ page }) => {
    // Add an exercise first
    await page.goto('/');
    await page.fill('#exercise-name', 'Yoga');
    await page.selectOption('#exercise-type', 'Flexibility');
    await page.fill('#exercise-duration', '45');
    await page.click('#interactive-btn');
    
    // Navigate to history page
    await page.goto('/page2.html');
    
    // Check if exercise is displayed
    await expect(page.locator('text=Yoga')).toBeVisible();
    await expect(page.locator('text=Flexibility')).toBeVisible();
    await expect(page.locator('text=45 min')).toBeVisible();
  });

  test('should delete an exercise from history', async ({ page }) => {
    // Add an exercise first
    await page.goto('/');
    await page.fill('#exercise-name', 'Swimming');
    await page.selectOption('#exercise-type', 'Cardio');
    await page.fill('#exercise-duration', '60');
    await page.click('#interactive-btn');
    
    // Navigate to history page
    await page.goto('/page2.html');
    
    // Verify exercise exists
    await expect(page.locator('text=Swimming')).toBeVisible();
    
    // Delete the exercise
    await page.locator('button:has-text("Delete")').first().click();
    
    // Verify exercise is removed
    await expect(page.locator('text=Swimming')).not.toBeVisible();
    await expect(page.locator('text=No exercises logged yet')).toBeVisible();
  });

  test('should show statistics correctly', async ({ page }) => {
    // Add multiple exercises
    await page.goto('/');
    
    // First exercise
    await page.fill('#exercise-name', 'Running');
    await page.selectOption('#exercise-type', 'Cardio');
    await page.fill('#exercise-duration', '30');
    await page.click('#interactive-btn');
    await page.waitForTimeout(500);
    
    // Second exercise
    await page.fill('#exercise-name', 'Weights');
    await page.selectOption('#exercise-type', 'Strength');
    await page.fill('#exercise-duration', '45');
    await page.click('#interactive-btn');
    
    // Navigate to statistics page
    await page.goto('/page3.html');
    
    // Check statistics
    await expect(page.locator('text=Total Exercises')).toBeVisible();
    await expect(page.locator('.stat-value').first()).toContainText('2');
    await expect(page.locator('text=75 min')).toBeVisible();
  });
});
