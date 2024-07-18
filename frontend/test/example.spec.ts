import { test, expect } from '@playwright/test';

//find elements with class name = note
// test('should find elements with class name note', async ({ page }) => {
//     await page.goto('http://localhost:3000/');
//     await expect(page.locator('.note')).not.toBeNull();
// })

test('navigate to the home page', async ({ page }) => {
    await page.goto('http://localhost:3000/')
    await page.click('text=home')
    await expect(page).toHaveURL('http://localhost:3000/homepage')
    await expect(page.locator('h1')).toContainText('home')
  })

test('add a new note', async ({ page }) => {
    await page.goto('http://localhost:3000/')
    await page.click('text=Add New Note')
    await page.fill('input[name="text_input_new_note"]', 'New note')
    await page.click('button[name="text_input_save_new_note"]')
    await page.waitForSelector('ul')
    await expect(page.locator('ul')).toContainText('New note')
})

test('return 404 for invalid note ID', async ({ page }) => {
    const invalidId = 999;  
    const [response] = await Promise.all([
      page.waitForResponse(`http://localhost:3001/notes/${invalidId}`),
      page.goto(`http://localhost:3001/notes/${invalidId}`)
    ]);
      expect(response.status()).toBe(404);
  });

test('toggle theme', async ({ page }) => {
    await page.goto('http://localhost:3000/')
    await page.click('text=toggle light mode')
    await page.waitForSelector('.note-dark');
    await expect(page.locator('.note-dark')).not.toBeNull();
})

test('have next page button', async ({ page }) => {
    await page.goto('http://localhost:3000/')
    await page.waitForSelector('text=Next');
    await expect(page.locator('text=Next')).not.toBeNull();
})

