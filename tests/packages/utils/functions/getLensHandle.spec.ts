import { IS_MAINNET } from '@lenstube/constants'
import { getLensHandle } from '@lenstube/generic'
import { expect, test } from '@playwright/test'

test('getLensHandle', () => {
  const handle = 'myhandle.lens'
  const name = handle.replace('.lens', '').replace('.test', '')
  const expectedHandle = `${name}.${IS_MAINNET ? 'lens' : 'test'}`
  const actualHandle = getLensHandle(handle)

  expect(actualHandle).toBe(expectedHandle)
})
