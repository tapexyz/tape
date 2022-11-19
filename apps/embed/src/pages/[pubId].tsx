import Video from '@components/Video'
import apolloNodeClient from '@lib/apollo'
import { LENSTUBE_APP_ID, LENSTUBE_BYTE_APP_ID } from '@utils/constants'
import { PublicationDetailsDocument } from 'lens'
import type { GetServerSideProps } from 'next'
import type { LenstubePublication } from 'src/types'

export default Video

interface Props {
  video: LenstubePublication
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const pubId = context.query.pubId as string
  const splitted = pubId.split('-')
  if (splitted.length !== 2) {
    return { notFound: true }
  }
  const { data, error } = await apolloNodeClient.query({
    query: PublicationDetailsDocument,
    variables: {
      request: { publicationId: pubId },
      sources: [LENSTUBE_APP_ID, LENSTUBE_BYTE_APP_ID]
    }
  })
  if (!data.publication || error) {
    return { notFound: true }
  }
  context.res.setHeader('Cache-Control', 'public, s-maxage=86400')
  return {
    props: { video: data.publication }
  }
}
