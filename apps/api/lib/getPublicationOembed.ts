import { PublicationDetailsDocument } from 'lens'
import type { LenstubePublication } from 'utils'
import { STATIC_ASSETS } from 'utils'
import getApolloClient from 'utils/functions/getApolloClient'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import imageCdn from 'utils/functions/imageCdn'
import truncate from 'utils/functions/truncate'

const apolloClient = getApolloClient()

const getPublicationOembed = async (publicationId: string, format: string) => {
  try {
    const { data } = await apolloClient.query({
      query: PublicationDetailsDocument,
      variables: { request: { publicationId } }
    })

    const video: LenstubePublication = data?.publication
    const title = truncate(video?.metadata?.name as string, 100)
    const thumbnail = imageCdn(
      getThumbnailUrl(video) || `${STATIC_ASSETS}/images/seo/og.png`,
      'thumbnail'
    )

    if (format === 'json') {
      return {
        title: title,
        author_name: video.profile?.handle,
        author_url: `https://lenstube.xyz/channel/${video.profile?.handle}`,
        type: 'video',
        height: 113,
        width: 200,
        version: '1.0',
        provider_name: 'Lenstube',
        provider_url: 'https://lenstube.xyz/',
        thumbnail_height: 360,
        thumbnail_width: 480,
        thumbnail_url: thumbnail,
        html: `<iframe width=\"200\" height=\"113\" src=\"https://embed.lenstube.xyz/${video.id}\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen title=\"${title}\"></iframe>`
      }
    }
    if (format === 'xml') {
      return `<oembed>
              <title>${title}</title>
              <author_name>${video.profile?.handle}</author_name>
              <author_url>https://lenstube.xyz/channel/${video.profile?.handle}</author_url>
              <type>video</type>
              <height>113</height>
              <width>200</width>
              <version>1.0</version>
              <provider_name>Lenstube</provider_name>
              <provider_url>https://lenstube.xyz/</provider_url>
              <thumbnail_height>360</thumbnail_height>
              <thumbnail_width>480</thumbnail_width>
              <thumbnail_url>${thumbnail}</thumbnail_url>
              <html><iframe width="200" height="113" src="https://embed.lenstube.xyz/${video.id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="${title}"></iframe></html>
              </oembed>`
    }
  } catch {
    return null
  }
}

export default getPublicationOembed
