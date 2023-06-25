import { checkIsBytesVideo } from '@lenstube/generic'
import { expect, test } from '@playwright/test'

test('returns true for videos shorter than 2 minutes', async () => {
  const durationInSeconds = 1 * 60
  expect(checkIsBytesVideo(durationInSeconds)).toBe(true)
})

test('returns false for videos 2 minutes or longer', async () => {
  const durationInSeconds = 2 * 60
  expect(checkIsBytesVideo(durationInSeconds)).toBe(false)
})
