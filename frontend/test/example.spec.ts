import { test, expect } from '@playwright/test';

//find elements with class name = note
// test('should find elements with class name note', async ({ page }) => {
//     await page.goto('http://localhost:3000/');
//     await expect(page.locator('.note')).not.toBeNull();
// })

test('add a new user is not logging in', async ({ page }) => {
    await page.goto('http://localhost:3000/')
    await page.click('text=Login')
    await page.fill('input[name="create_user_form_name"]', 'NewName');
    await page.fill('input[name="create_user_form_email"]', 'NewUser');
    await page.fill('input[name="create_user_form_username"]', 'NewUser');
    await page.fill('input[name="create_user_form_password"]', '1234');
    await page.click('button[name="create_user_form_create_user"]');
    await expect(page.locator('.login_form_login')).not.toBeNull();
});

test('there is no add a new note button for unsigned user', async ({ page }) => {
    await page.goto('http://localhost:3000/')
    const addNoteButton = await page.locator('.add_new_note');
    await expect(addNoteButton).toHaveCount(0);

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

