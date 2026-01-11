import { test, expect } from '@playwright/test';

test.describe('Pet Insurance Form Tests', () => {
  test('should load pet insurance form page', async ({ page }) => {
    await page.goto('/pet-insurance.html');
    await expect(page).toHaveTitle('Pet Insurance - Get Your Quote');
    
    // Check if main heading is visible
    await expect(page.locator('h1')).toHaveText('Pet Insurance');
    
    // Check first question is visible
    await expect(page.locator('h2:has-text("What\'s your pet\'s name?")')).toBeVisible();
  });

  test('should navigate to pet insurance from home page', async ({ page }) => {
    await page.goto('/');
    
    // Click on Pet Insurance link
    await page.click('#nav-pet-insurance');
    await expect(page).toHaveURL(/.*pet-insurance.html/);
    await expect(page).toHaveTitle('Pet Insurance - Get Your Quote');
  });

  test('should show questions one at a time', async ({ page }) => {
    await page.goto('/pet-insurance.html');
    
    // First question should be visible
    await expect(page.locator('.question.active h2')).toContainText("What's your pet's name?");
    
    // Fill first question and continue
    await page.fill('input[name="petName"]', 'Max');
    await page.click('button.next-button');
    
    // Second question should now be visible with personalized name
    await expect(page.locator('.question.active h2')).toContainText("What type of pet is Max?");
  });

  test('should auto-advance on radio button selection', async ({ page }) => {
    await page.goto('/pet-insurance.html');
    
    // Fill first question
    await page.fill('input[name="petName"]', 'Buddy');
    await page.click('button.next-button');
    
    // Select a radio button (should auto-advance)
    await page.check('input[value="dog"]');
    
    // Wait for auto-advance (400ms delay in code)
    await page.waitForTimeout(500);
    
    // Next question should be visible
    await expect(page.locator('.question.active h2')).toContainText("What breed is");
  });

  test('should allow navigation back and forth', async ({ page }) => {
    await page.goto('/pet-insurance.html');
    
    // Fill and advance through first question
    await page.fill('input[name="petName"]', 'Charlie');
    await page.click('button.next-button');
    
    // We should now be at question 2
    await expect(page.locator('.question.active h2')).toContainText("What type of pet is Charlie?");
    
    // Select pet type
    await page.check('input[value="cat"]');
    await page.waitForTimeout(500); // Wait for auto-advance
    
    // Should be at question 3 now
    await expect(page.locator('.question.active h2')).toContainText("What breed");
    
    // Click back button
    await page.click('button.back-button');
    
    // Should be back at question 2
    await expect(page.locator('.question.active h2')).toContainText("What type of pet is Charlie?");
  });

  test('should complete entire conversational flow', async ({ page }) => {
    await page.goto('/pet-insurance.html');
    
    // Question 1: Pet name
    await page.fill('input[name="petName"]', 'Luna');
    await page.click('button.next-button');
    await page.waitForTimeout(300);
    
    // Question 2: Pet type (auto-advances)
    await page.check('input[value="dog"]');
    await page.waitForTimeout(600); // Wait for auto-advance
    
    // Question 3: Breed
    await expect(page.locator('.question.active h2')).toContainText("What breed");
    await page.fill('input[name="breed"]', 'Golden Retriever');
    await page.click('button.next-button');
    await page.waitForTimeout(300);
    
    // Question 4: Age
    await expect(page.locator('.question.active h2')).toContainText("How old");
    await page.fill('input[name="age"]', '3');
    await page.click('button.next-button');
    await page.waitForTimeout(300);
    
    // Question 5: Coverage (auto-advances)
    await expect(page.locator('.question.active h2')).toContainText("Choose your coverage");
    await page.check('input[value="premium"]');
    await page.waitForTimeout(600); // Wait for auto-advance
    
    // Question 6: Additional coverage
    await expect(page.locator('.question.active h2')).toContainText("additional coverage");
    await page.check('input[value="dental"]');
    await page.click('button.next-button');
    await page.waitForTimeout(300);
    
    // Question 7: Owner name
    await expect(page.locator('.question.active h2')).toContainText("What's your name");
    await page.fill('input[name="ownerName"]', 'Sarah Johnson');
    await page.click('button.next-button');
    await page.waitForTimeout(300);
    
    // Question 8: Email
    await expect(page.locator('.question.active h2')).toContainText("Where can we reach you");
    await page.fill('input[name="email"]', 'sarah@example.com');
    await page.click('button.next-button');
    await page.waitForTimeout(300);
    
    // Question 9: Phone
    await expect(page.locator('.question.active h2')).toContainText("What's your phone number");
    await page.fill('input[name="phone"]', '5559876543');
    await page.click('button.next-button');
    await page.waitForTimeout(300);
    
    // Question 10: ZIP
    await expect(page.locator('.question.active h2')).toContainText("what's your ZIP code");
    await page.fill('input[name="zipCode"]', '90210');
    
    // Verify we're at the last question
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should navigate back to home', async ({ page }) => {
    await page.goto('/pet-insurance.html');
    
    // Click back to home link
    await page.click('text=← Back to Home');
    await expect(page).toHaveURL(/.*index.html/);
    await expect(page).toHaveTitle('Hello World');
  });
});
