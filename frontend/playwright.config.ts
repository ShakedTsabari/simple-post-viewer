import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test',
  retries: 1,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
});
