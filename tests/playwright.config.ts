import type { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'
import * as os from 'os'

const config: PlaywrightTestConfig = {
  testDir: './',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: os.cpus().length - 1,
  reporter: 'list',
  use: {
    actionTimeout: 0,
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      },
      fullyParallel: true
    }
  ]
}

export default config
