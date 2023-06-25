import type { Publication } from '@lenstube/lens'
import { expect, test } from '@playwright/test'
import getMetadataHash from 'utils/functions/getMetadataHash'

test('getMetadataHash', async () => {
  const publication = {
    onChainContentURI:
      'ipfs://bafybeic7346c53qefcpm4kbiyhmwomqutcqi3bhf6gppocnajppiui475u'
  }

  const expectedHash =
    'bafybeic7346c53qefcpm4kbiyhmwomqutcqi3bhf6gppocnajppiui475u'
  const actualHash = getMetadataHash(publication as Publication)

  expect(actualHash).toBe(expectedHash)
})
