import type { AnyPublication, PublicationRequest } from '@tape.xyz/lens'
import type { NextApiResponse } from 'next'

import { getMetaTags } from '@tape.xyz/browser'
import {
  OG_IMAGE,
  TAPE_APP_DESCRIPTION,
  TAPE_APP_NAME
} from '@tape.xyz/constants'
import {
  getPublication,
  getPublicationData,
  getThumbnailUrl,
  imageCdn,
  truncate
} from '@tape.xyz/generic'
import { PublicationDocument } from '@tape.xyz/lens'
import { apolloClient } from '@tape.xyz/lens/apollo'

const client = apolloClient()

const getPublicationMeta = async (
  res: NextApiResponse,
  publicationId: string
) => {
  try {
    const { data } = await client.query({
      query: PublicationDocument,
      variables: {
        request: { forId: publicationId } as PublicationRequest
      }
    })

    const publication = data?.publication as AnyPublication
    const target = getPublication(publication)
    const isAudio = target.metadata.__typename === 'AudioMetadataV3'

    const title = truncate(
      getPublicationData(target.metadata)?.title as string,
      100
    )
    const description = truncate(
      getPublicationData(target.metadata)?.content as string,
      100
    )
    const thumbnail = imageCdn(
      getThumbnailUrl(target.metadata) || OG_IMAGE,
      'THUMBNAIL'
    )

    return res
      .setHeader('Content-Type', 'text/html')
      .setHeader('Cache-Control', 's-maxage=86400')
      .send(
        getMetaTags({
          description: description.replaceAll('\n', ' '),
          image: thumbnail,
          page: isAudio ? 'AUDIO' : 'VIDEO',
          pubId: target.id,
          publication: target,
          title
        })
      )
  } catch {
    return res.setHeader('Content-Type', 'text/html').send(
      getMetaTags({
        description: TAPE_APP_DESCRIPTION,
        image: OG_IMAGE,
        title: TAPE_APP_NAME
      })
    )
  }
}

export default getPublicationMeta
