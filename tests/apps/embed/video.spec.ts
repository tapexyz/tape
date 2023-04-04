import { expect, test } from '@playwright/test'

test('has bytes', async ({ page }) => {
  await page.goto('http://localhost:4001/0x2d-0x01be')

  // Check if the video thumbnail is present
  const thumbnail = page.locator('img').first()
  await expect(thumbnail).toBeVisible()

  // Click on the play button to start the video
  const playButton = page.locator('button')
  await playButton.click()

  // Wait for the VideoPlayer to load and become visible
  const videoPlayer = page.locator('video')
  await expect(videoPlayer).toBeVisible()

  // Check if the video is playing
  const isPaused = await videoPlayer.evaluate(
    (video: HTMLVideoElement) => video.paused
  )
  expect(isPaused).toBeFalsy()
})
