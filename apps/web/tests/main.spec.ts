import { test, expect, chromium } from '@playwright/test';
import { existsSync } from 'fs';

let hasChromium = true;
try {
  const executable = chromium.executablePath();
  if (!executable || !existsSync(executable)) {
    hasChromium = false;
  }
} catch (error) {
  hasChromium = false;
}

test.skip(!hasChromium, 'Chromium no está disponible en el entorno de pruebas');

test('homepage has hero section', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Centraliza tus licitaciones' })).toBeVisible();
});
