import { expect, test } from '@playwright/test'

test('has layout', async ({ page }) => {
  await page.goto('http://localhost:4783')

  const sidebarItemsCount = await page.getByTestId('sidebar-items').count()
  expect(sidebarItemsCount === 4)

  const globalSearch = page.getByTestId('global-search')
  expect(globalSearch)

  const input = globalSearch.getByPlaceholder('Search by channel / hashtag')
  await input.fill('sasicodes')

  const searchChannelsPanel = page.getByTestId('search-channels-panel')
  expect(searchChannelsPanel.getByTestId('search-channel-sasicodes.lens'))
})
