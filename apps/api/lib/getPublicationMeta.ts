import { getMetaTags } from '@lenstube/browser'
import { LENSTUBE_APP_DESCRIPTION, OG_IMAGE } from '@lenstube/constants'
import { getThumbnailUrl, imageCdn, truncate } from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import { PublicationDetailsDocument } from '@lenstube/lens'
import apolloClient from '@lenstube/lens/apollo'
import type { NextApiResponse } from 'next'

const getPublicationMeta = async (
  res: NextApiResponse,
  publicationId: string
) => {
  try {
    const { data } = await apolloClient().query({
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
        title: 'Lenstube',
        description: LENSTUBE_APP_DESCRIPTION,
        image: OG_IMAGE
      })
    )
  }
}

export default getPublicationMeta
