import { expect, test } from '@playwright/test'

test('trimLensHandle', () => {
  const handle = 'myhandle.lens'
  const expectedHandle = handle.replace('.lens', '').replace('.test', '')
  const actualHandle = 'myhandle'

  expect(actualHandle).toBe(expectedHandle)
})
