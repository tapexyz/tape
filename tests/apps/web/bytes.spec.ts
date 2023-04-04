import { expect, test } from '@playwright/test'

test('has bytes', async ({ page }) => {
  await page.goto('http://localhost:4783/bytes')

  await expect(page).toHaveTitle(/Bytes/)
})
