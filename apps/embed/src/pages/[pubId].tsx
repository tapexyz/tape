import Video from '@components/Video'
import { LENSTUBE_APP_ID, LENSTUBE_BYTE_APP_ID } from '@utils/constants'
import type { GetServerSideProps } from 'next'
import apolloNodeClient from 'src/gql/apollo'
import { VIDEO_DETAIL_QUERY } from 'src/gql/queries'
import type { LenstubePublication } from 'src/types/local'

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
    query: VIDEO_DETAIL_QUERY,
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
