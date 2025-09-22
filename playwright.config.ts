
import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'pnpm --filter @apps/web dev --port 3000',
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  testDir: 'e2e',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
  },
});
