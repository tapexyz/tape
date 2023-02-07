import { expect, test } from '@playwright/test'

test('has channel', async ({ page }) => {
  await page.goto('http://localhost:4783')

  const videos = page.getByTestId('curated-videos')
  expect((await videos.count()) > 0)

  const card = videos.getByTestId('video-card').first()

  await card.getByTestId('video-card-channel').click()

  expect(page.getByTestId('channel-name'))
  expect(page.getByTestId('video-card'))
})
