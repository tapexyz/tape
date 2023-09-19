import { getMetaTags } from '@lenstube/browser'
import { LENSTUBE_APP_DESCRIPTION, OG_IMAGE } from '@lenstube/constants'
import { getThumbnailUrl, imageCdn, truncate } from '@lenstube/generic'
import type { AnyPublication, MirrorablePublication } from '@lenstube/lens'
import { PublicationDocument } from '@lenstube/lens'
import { apolloClient } from '@lenstube/lens/apollo'
import type { NextApiResponse } from 'next'

const client = apolloClient()

const getPublicationMeta = async (
  res: NextApiResponse,
  publicationId: string
) => {
  try {
    const { data } = await client.query({
      query: PublicationDocument,
      variables: { request: { publicationId } }
    })

    const publication = data?.publication as AnyPublication
    const video =
      publication?.__typename === 'Mirror'
        ? publication.mirrorOn
        : (publication as MirrorablePublication)

    const title = truncate(video?.metadata?.marketplace?.name as string, 100)
    const description = truncate(
      video?.metadata?.marketplace?.description as string,
      100
    )
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
        title: 'Lenstube',
        description: LENSTUBE_APP_DESCRIPTION,
        image: OG_IMAGE
      })
    )
  }
}

export default getPublicationMeta
