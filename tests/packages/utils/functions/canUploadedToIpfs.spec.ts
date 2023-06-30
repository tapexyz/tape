import { IPFS_FREE_UPLOAD_LIMIT } from '@lenstube/constants'
import { canUploadedToIpfs } from '@lenstube/generic'
import { expect, test } from '@playwright/test'

test('returns true for values within the limit', async () => {
  const bytes = IPFS_FREE_UPLOAD_LIMIT * 1024 * 2
  expect(canUploadedToIpfs(bytes)).toBe(true)
})

test('returns false for values exceeding the limit', async () => {
  const bytes = (IPFS_FREE_UPLOAD_LIMIT + 1) * 1024 ** 2
  expect(canUploadedToIpfs(bytes)).toBe(false)
})

test('returns false for null and undefined values', async () => {
  expect(canUploadedToIpfs(null)).toBe(false)
  // eslint-disable-next-line unicorn/no-useless-undefined
  expect(canUploadedToIpfs(undefined)).toBe(false)
})
