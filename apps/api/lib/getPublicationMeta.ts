import { getMetaTags } from '@tape.xyz/browser'
import {
  OG_IMAGE,
  TAPE_APP_DESCRIPTION,
  TAPE_APP_NAME
} from '@tape.xyz/constants'
import { getThumbnailUrl, imageCdn, truncate } from '@tape.xyz/generic'
import type { Publication } from '@tape.xyz/lens'
import { PublicationDetailsDocument } from '@tape.xyz/lens'
import { apolloClient } from '@tape.xyz/lens/apollo'
import type { NextApiResponse } from 'next'

const client = apolloClient()

const getPublicationMeta = async (
  res: NextApiResponse,
  publicationId: string
) => {
  try {
    const { data } = await client.query({
      query: PublicationDetailsDocument,
      variables: { request: { publicationId } }
    })

    const publication = data?.publication as Publication
    const video =
      publication?.__typename === 'Mirror' ? publication.mirrorOf : publication

    const title = truncate(video?.metadata?.name as string, 100)
    const description = truncate(video?.metadata?.description as string, 100)
    const thumbnail = imageCdn(getThumbnailUrl(video) || OG_IMAGE, 'THUMBNAIL')

    return res
      .setHeader('Content-Type', 'text/html')
      .setHeader('Cache-Control', 's-maxage=86400')
      .send(
        getMetaTags({
          title,
          description: description.replaceAll('\n', ' '),
          image: thumbnail,
          page: 'VIDEO',
          pubId: video.id,
          publication: video
        })
      )
  } catch {
    return res.setHeader('Content-Type', 'text/html').send(
      getMetaTags({
        title: TAPE_APP_NAME,
        description: TAPE_APP_DESCRIPTION,
        image: OG_IMAGE
      })
    )
  }
}

export default getPublicationMeta
