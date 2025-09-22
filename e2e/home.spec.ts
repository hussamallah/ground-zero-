
import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Ground Zero' })).toBeVisible();
  await page.getByRole('link', { name: 'Try demo quiz' }).click();
  await expect(page.getByRole('heading', { name: 'Phase 1 • Control' })).toBeVisible();
});
