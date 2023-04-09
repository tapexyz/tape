import { expect, test } from '@playwright/test'
import getUserLocale from 'utils/functions/getUserLocale'

test('get user locale', () => {
  const locale = getUserLocale()
  expect(locale).toBeDefined()
})
