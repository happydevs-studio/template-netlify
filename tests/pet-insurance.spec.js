import { test, expect } from '@playwright/test';

test.describe('Pet Insurance Form Tests', () => {
  test('should display pet insurance form with initial step', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Pet Insurance - Get Covered');
    
    // Check progress bar shows step 1
    const progressBar = page.locator('#progress-bar');
    await expect(progressBar).toHaveAttribute('data-step', '1');
    
    // Check heading in active step
    await expect(page.locator('.step.active h1')).toContainText('What type of pet do you have?');
    
    // Check pet type cards exist
    await expect(page.locator('#pet-type-dog')).toBeVisible();
    await expect(page.locator('#pet-type-cat')).toBeVisible();
  });

  test('should navigate through entire form flow', async ({ page }) => {
    await page.goto('/');
    
    // Step 1: Select pet type
    await page.click('#pet-type-dog');
    await page.click('#step1-next');
    
    // Verify we're on step 2
    await expect(page.locator('.step.active h1')).toContainText('Tell us about your pet');
    const progressBar = page.locator('#progress-bar');
    await expect(progressBar).toHaveAttribute('data-step', '2');
    
    // Step 2: Fill pet details
    await page.fill('#pet-name', 'Max');
    await page.selectOption('#pet-age', 'adult');
    await page.fill('#pet-breed', 'Labrador');
    await page.click('#step2-next');
    
    // Verify we're on step 3
    await expect(page.locator('.step.active h1')).toContainText('Choose your coverage');
    await expect(progressBar).toHaveAttribute('data-step', '3');
    
    // Step 3: Select coverage
    await page.click('#coverage-basic');
    await page.click('#step3-next');
    
    // Verify we're on step 4
    await expect(page.locator('.step.active h1')).toContainText('Your contact information');
    await expect(progressBar).toHaveAttribute('data-step', '4');
    
    // Step 4: Fill contact info
    await page.fill('#owner-name', 'Jane Doe');
    await page.fill('#owner-email', 'jane@example.com');
    await page.fill('#owner-phone', '555-0123');
    await page.click('#step4-next');
    
    // Verify we're on step 5 (summary)
    await expect(page.locator('.step.active h1')).toContainText('Review your coverage');
    await expect(progressBar).toHaveAttribute('data-step', '5');
    
    // Verify summary contains correct information
    await expect(page.locator('#summary-content')).toContainText('Max');
    await expect(page.locator('#summary-content')).toContainText('Labrador');
    await expect(page.locator('#summary-content')).toContainText('Jane Doe');
    await expect(page.locator('#summary-content')).toContainText('jane@example.com');
    await expect(page.locator('#summary-content')).toContainText('$25/month');
  });

  test('should validate required fields on step 2', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to step 2
    await page.click('#pet-type-cat');
    await page.click('#step1-next');
    
    // Try to proceed without filling fields
    await page.click('#step2-next');
    
    // Should still be on step 2
    await expect(page.locator('.step.active h1')).toContainText('Tell us about your pet');
    
    // Check validation errors are displayed
    await expect(page.locator('#pet-name')).toHaveClass(/invalid/);
    await expect(page.locator('#pet-age')).toHaveClass(/invalid/);
    await expect(page.locator('#pet-breed')).toHaveClass(/invalid/);
  });

  test('should validate required fields on step 4', async ({ page }) => {
    await page.goto('/');
    
    // Navigate through to step 4
    await page.click('#pet-type-dog');
    await page.click('#step1-next');
    
    await page.fill('#pet-name', 'Buddy');
    await page.selectOption('#pet-age', 'young');
    await page.fill('#pet-breed', 'Beagle');
    await page.click('#step2-next');
    
    await page.click('#coverage-standard');
    await page.click('#step3-next');
    
    // Try to proceed without filling contact info
    await page.click('#step4-next');
    
    // Should still be on step 4
    await expect(page.locator('.step.active h1')).toContainText('Your contact information');
    
    // Check validation errors are displayed
    await expect(page.locator('#owner-name')).toHaveClass(/invalid/);
    await expect(page.locator('#owner-email')).toHaveClass(/invalid/);
    await expect(page.locator('#owner-phone')).toHaveClass(/invalid/);
  });

  test('should allow navigation back through steps', async ({ page }) => {
    await page.goto('/');
    
    // Navigate forward to step 3
    await page.click('#pet-type-cat');
    await page.click('#step1-next');
    
    await page.fill('#pet-name', 'Whiskers');
    await page.selectOption('#pet-age', 'senior');
    await page.fill('#pet-breed', 'Persian');
    await page.click('#step2-next');
    
    // Verify on step 3
    await expect(page.locator('.step.active h1')).toContainText('Choose your coverage');
    
    // Click back to step 2 (use visible button in active step)
    await page.locator('.step.active .btn-secondary').click();
    await expect(page.locator('.step.active h1')).toContainText('Tell us about your pet');
    
    // Verify data is preserved
    await expect(page.locator('#pet-name')).toHaveValue('Whiskers');
    await expect(page.locator('#pet-breed')).toHaveValue('Persian');
  });

  test('should show selected coverage with visual feedback', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to coverage step
    await page.click('#pet-type-dog');
    await page.click('#step1-next');
    
    await page.fill('#pet-name', 'Rex');
    await page.selectOption('#pet-age', 'puppy');
    await page.fill('#pet-breed', 'Husky');
    await page.click('#step2-next');
    
    // Click premium coverage
    await page.click('#coverage-premium');
    
    // Verify it has selected class
    await expect(page.locator('#coverage-premium')).toHaveClass(/selected/);
    
    // Verify others don't have selected class
    await expect(page.locator('#coverage-basic')).not.toHaveClass(/selected/);
    await expect(page.locator('#coverage-standard')).not.toHaveClass(/selected/);
  });
});
