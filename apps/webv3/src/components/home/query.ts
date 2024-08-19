import { infiniteQueryOptions } from '@tanstack/react-query'
import { TAPE_APP_ID } from '@tape.xyz/constants'
import {
  execute,
  LimitType,
  PublicationMetadataMainFocusType,
  PublicationsDocument,
  PublicationType
} from '@tape.xyz/lens/gql'

export const publicationsQuery = infiniteQueryOptions({
  queryKey: ['publications'],
  queryFn: ({ pageParam }) =>
    execute(PublicationsDocument, {
      request: {
        where: {
          publicationTypes: [PublicationType.Post],
          metadata: {
            mainContentFocus: [PublicationMetadataMainFocusType.Video],
            publishedOn: [TAPE_APP_ID]
          },
          from: [
            '0x020b57',
            '0x01d8d5',
            '0x01a4f3',
            '0x5321',
            '0x2e09',
            '0x01d023',
            '0x01c6a9',
            '0x01ee54',
            '0x01a4b0',
            '0x01cada',
            '0x0106ba',
            '0x2d',
            '0x01bc6f',
            '0x0119c8',
            '0x5db9',
            '0x01a1b9',
            '0x01',
            '0x01c74b',
            '0xa68c',
            '0xf1b1',
            '0x2d0e',
            '0x01c969',
            '0x0105f8',
            '0x04b943',
            '0x01c7d9',
            '0x012d4e',
            '0x070b7c',
            '0x01a8e6',
            '0x326c',
            '0x01c845',
            '0x0186e6',
            '0x07d1c4',
            '0x0ab7',
            '0x070f84',
            '0x0164ad',
            '0x03d935',
            '0x578f',
            '0x2a6b',
            '0x020d1f',
            '0x015b36',
            '0x019a2a',
            '0xbb03',
            '0xeca7',
            '0x01d912',
            '0xd63c',
            '0x01e547',
            '0xbf42',
            '0x01944f',
            '0x0161ba',
            '0x7dee'
          ]
        },
        limit: LimitType.Fifty,
        cursor: pageParam
      }
    }),
  initialPageParam: null,
  getNextPageParam: (lastPage) => lastPage.publications.pageInfo.next
})
