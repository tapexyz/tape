import {
  OG_IMAGE,
  TAPE_APP_NAME,
  TAPE_EMBED_URL,
  TAPE_WEBSITE_URL
} from '@tape.xyz/constants'
import {
  getProfile,
  getPublicationData,
  isMirrorPublication
} from '@tape.xyz/generic'
import type { AnyPublication } from '@tape.xyz/lens'
import { PublicationDocument } from '@tape.xyz/lens'
import { apolloClient } from '@tape.xyz/lens/apollo'
import type { Metadata } from 'next'

import common from '@/common'

type Props = {
  params: { id: string }
}

const client = apolloClient()

const secondsToISO = (seconds: string | undefined) => {
  const SECONDS_PER_SECOND = 1
  const SECONDS_PER_MINUTE = 60
  const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE
  const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR

  const designations = [
    ['D', SECONDS_PER_DAY],
    ['H', SECONDS_PER_HOUR],
    ['M', SECONDS_PER_MINUTE],
    ['S', SECONDS_PER_SECOND]
  ]
  let duration = 'P'
  let remainder = seconds ? Math.abs(Number(seconds ?? 0)) : 0 // Use Math.abs to ensure a positive value

  designations.forEach(([sign, seconds]) => {
    const value = Math.floor(remainder / (seconds as number))
    remainder = remainder % (seconds as number)
    if (value) {
      duration += `${value}${sign}`
    }
  })
  if (duration == 'P') {
    duration = 'P0S'
  }
  return duration // ex: P2M47S
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params
  const { data } = await client.query({
    query: PublicationDocument,
    variables: { request: { forId: id } }
  })

  if (!data.publication) {
    return common
  }

  const publication = data.publication as AnyPublication
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication
  const { by: profile, metadata } = targetPublication
  const publicationTitle = getPublicationData(metadata)?.title || ''
  const publicationContent = getPublicationData(metadata)?.content || ''
  const publicationCover =
    getPublicationData(metadata)?.asset?.cover || OG_IMAGE
  const duration = getPublicationData(metadata)?.asset?.duration

  const title = `${publicationTitle} by ${
    getProfile(profile).slugWithPrefix
  } • ${TAPE_APP_NAME}`
  const embedUrl = `${TAPE_EMBED_URL}/${targetPublication.id}`

  return {
    title,
    description: publicationContent,
    metadataBase: new URL(`${TAPE_WEBSITE_URL}/watch/${targetPublication.id}`),
    openGraph: {
      title,
      description: publicationContent,
      type: 'video.episode',
      images: [publicationCover],
      siteName: TAPE_APP_NAME,
      videos: [embedUrl],
      duration,
      url: embedUrl
    },
    twitter: {
      title,
      description: publicationContent,
      card: 'player',
      images: [publicationCover]
    }
  }
}

export default async function Page({ params }: Props) {
  return <div>{params.id}</div>
}
