import { trimLensHandle } from '@lenstube/generic'
import { expect, test } from '@playwright/test'

test('trimLensHandle', () => {
  const handle = 'myhandle.lens'

  const expectedHandle = 'myhandle'
  const actualHandle = trimLensHandle('myhandle.lens')
  expect(actualHandle).toBe(expectedHandle)

  const actualHandleWithTld = trimLensHandle('myhandle.lens', true)
  expect(actualHandleWithTld).toBe(handle)
})
