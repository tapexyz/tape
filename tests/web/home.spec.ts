import { expect, test } from '@playwright/test'

test('has sections', async ({ page }) => {
  await page.goto('http://localhost:4783')

  expect(page.getByTestId('category-filters'))
  expect(page.getByTestId('bytes-section'))
  expect(page.getByTestId('curated-videos'))
})
