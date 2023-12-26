import {
  OG_IMAGE,
  TAPE_APP_NAME,
  TAPE_EMBED_URL,
  TAPE_WEBSITE_URL
} from '@tape.xyz/constants'
import {
  getProfile,
  getPublicationData,
  getThumbnailUrl,
  imageCdn,
  truncate
} from '@tape.xyz/generic'
import type {
  AnyPublication,
  MirrorablePublication,
  PublicationRequest
} from '@tape.xyz/lens'
import { PublicationDocument } from '@tape.xyz/lens'
import { apolloClient } from '@tape.xyz/lens/apollo'

const client = apolloClient()

const getPublicationOembed = async (publicationId: string, format: string) => {
  try {
    const { data } = await client.query({
      query: PublicationDocument,
      variables: {
        request: { forId: publicationId } as PublicationRequest
      }
    })
    const publication = data?.publication as AnyPublication
    const video =
      publication?.__typename === 'Mirror'
        ? publication.mirrorOn
        : (publication as MirrorablePublication)

    const title = truncate(
      getPublicationData(video.metadata)?.title as string,
      100
    ).replaceAll('"', "'")
    const thumbnail = imageCdn(
      getThumbnailUrl(video.metadata) || OG_IMAGE,
      'THUMBNAIL'
    )

    if (format === 'json') {
      return {
        title,
        author_name: getProfile(video.by)?.slug,
        author_url: `${TAPE_WEBSITE_URL}/u/${getProfile(video.by)?.slug}`,
        type: 'video',
        height: 113,
        width: 200,
        version: '1.0',
        provider_name: TAPE_APP_NAME,
        provider_url: TAPE_WEBSITE_URL,
        thumbnail_height: 360,
        thumbnail_width: 480,
        thumbnail_url: thumbnail,
        html: `<iframe width="200" height="113" src="${TAPE_EMBED_URL}/${video.id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="${title}"></iframe>`
      }
    }
    if (format === 'xml') {
      return `<oembed>
              <title>${title}</title>
              <author_name>${getProfile(video.by)?.slug}</author_name>
              <author_url>${TAPE_WEBSITE_URL}/u/${getProfile(video.by)
                ?.slug}</author_url>
              <type>video</type>
              <height>113</height>
              <width>200</width>
              <version>1.0</version>
              <provider_name>${TAPE_APP_NAME}</provider_name>
              <provider_url>${TAPE_WEBSITE_URL}</provider_url>
              <thumbnail_height>360</thumbnail_height>
              <thumbnail_width>480</thumbnail_width>
              <thumbnail_url>${thumbnail}</thumbnail_url>
              <html>
                <iframe width="200" height="113" src="${TAPE_EMBED_URL}/${
                  video.id
                }" title="${TAPE_APP_NAME} player" frameborder="0" allow="accelerometer; autoplay; clipboard-write;" allowfullscreen="true"></iframe>
              </html>
              </oembed>`
    }
  } catch {
    return null
  }
}

export default getPublicationOembed
