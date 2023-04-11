import type { Publication } from 'lens'
import { PublicationDetailsDocument } from 'lens'
import {
  LENSTUBE_APP_NAME,
  LENSTUBE_EMBED_URL,
  LENSTUBE_WEBSITE_URL,
  OG_IMAGE
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
    const publication = data?.publication as Publication
    const video =
      publication?.__typename === 'Mirror' ? publication.mirrorOf : publication

    const title = truncate(video?.metadata?.name as string, 100).replaceAll(
      '"',
      "'"
    )
    const thumbnail = imageCdn(getThumbnailUrl(video) || OG_IMAGE, 'thumbnail')

    if (format === 'json') {
      return {
        title,
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
                <iframe width="200" height="113" src="${LENSTUBE_EMBED_URL}/${video.id}" title="Lenstube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write;" allowfullscreen="true"></iframe>
              </html>
              </oembed>`
    }
  } catch {
    return null
  }
}

export default getPublicationOembed
