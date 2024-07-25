import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: [{
    command: 'npm run dev',
    url: 'http://localhost:3000',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  }],
  testDir: './test',
  retries: 1,
  use: {
    baseURL: 'http://localhost:3000'
  },
});
