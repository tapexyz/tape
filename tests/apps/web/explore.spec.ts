import { expect, test } from '@playwright/test'

test('has explore', async ({ page }) => {
  await page.goto('http://localhost:4783/explore')

  await expect(page).toHaveTitle(/Explore/)
})
