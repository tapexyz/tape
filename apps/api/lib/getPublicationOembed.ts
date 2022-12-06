import { PublicationDetailsDocument } from 'lens'
import type { LenstubePublication } from 'utils'
import {
  LENSTUBE_APP_NAME,
  LENSTUBE_EMBED_URL,
  LENSTUBE_WEBSITE_URL,
  STATIC_ASSETS
} from 'utils'
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
    const title = truncate(video?.metadata?.name as string, 100).replace(
      '"',
      "'"
    )
    const thumbnail = imageCdn(
      getThumbnailUrl(video) || `${STATIC_ASSETS}/images/seo/og.png`,
      'thumbnail'
    )

    if (format === 'json') {
      return {
        title: title,
        author_name: video.profile?.handle,
        author_url: `${LENSTUBE_WEBSITE_URL}/channel/${video.profile?.handle}`,
        type: 'video',
        height: 113,
        width: 200,
        version: '1.0',
        provider_name: LENSTUBE_APP_NAME,
        provider_url: LENSTUBE_WEBSITE_URL,
        thumbnail_height: 360,
        thumbnail_width: 480,
        thumbnail_url: thumbnail,
        html: `<iframe width="200" height="113" src="${LENSTUBE_EMBED_URL}/${video.id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="${title}"></iframe>`
      }
    }
    if (format === 'xml') {
      return `<oembed>
              <title>${title}</title>
              <author_name>${video.profile?.handle}</author_name>
              <author_url>${LENSTUBE_WEBSITE_URL}/channel/${video.profile?.handle}</author_url>
              <type>video</type>
              <height>113</height>
              <width>200</width>
              <version>1.0</version>
              <provider_name>${LENSTUBE_APP_NAME}</provider_name>
              <provider_url>${LENSTUBE_WEBSITE_URL}</provider_url>
              <thumbnail_height>360</thumbnail_height>
              <thumbnail_width>480</thumbnail_width>
              <thumbnail_url>${thumbnail}</thumbnail_url>
              <html>
                <iframe width="200" height="113" src="${LENSTUBE_EMBED_URL}/${video.id}" title="Lenstube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write;" allowfullscreen="true" title="${title}"></iframe>
              </html>
              </oembed>`
    }
  } catch {
    return null
  }
}

export default getPublicationOembed
