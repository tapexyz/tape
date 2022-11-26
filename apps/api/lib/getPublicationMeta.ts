import { PublicationDetailsDocument } from 'lens'
import type { NextApiResponse } from 'next'
import type { LenstubePublication } from 'utils'
import { LENSTUBE_APP_DESCRIPTION, STATIC_ASSETS } from 'utils'
import getApolloClient from 'utils/functions/getApolloClient'
import getMetaTags from 'utils/functions/getMetaTags'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import imageCdn from 'utils/functions/imageCdn'
import truncate from 'utils/functions/truncate'

const apolloClient = getApolloClient()

const getPublicationMeta = async (
  res: NextApiResponse,
  publicationId: string
) => {
  try {
    const { data } = await apolloClient.query({
      query: PublicationDetailsDocument,
      variables: { request: { publicationId } }
    })

    const video: LenstubePublication = data?.publication
    const title = truncate(video?.metadata?.name as string, 100)
    const description = truncate(video?.metadata?.description as string, 100)
    const thumbnail = imageCdn(
      getThumbnailUrl(video) || `${STATIC_ASSETS}/images/seo/og.png`,
      'thumbnail'
    )

    return res
      .setHeader('Content-Type', 'text/html')
      .setHeader('Cache-Control', 's-maxage=86400')
      .send(
        getMetaTags({
          title,
          description: description.replaceAll('\n', ' '),
          image: thumbnail,
          page: 'VIDEO',
          pubId: video.id
        })
      )
  } catch {
    return res.setHeader('Content-Type', 'text/html').send(
      getMetaTags({
        title: 'Lenstube',
        description: LENSTUBE_APP_DESCRIPTION,
        image: `${STATIC_ASSETS}/images/seo/og.png`
      })
    )
  }
}

export default getPublicationMeta
