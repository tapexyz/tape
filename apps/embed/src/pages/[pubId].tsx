import Video from '@components/Video'
import { PublicationDetailsDocument } from 'lens'
import type { GetServerSideProps } from 'next'
import type { LenstubePublication } from 'utils'
import { LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID } from 'utils'
import getApolloClient from 'utils/functions/getApolloClient'

export default Video

interface Props {
  video: LenstubePublication
}

const apolloClient = getApolloClient()

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const pubId = context.query.pubId as string
  const splitted = pubId.split('-')
  if (splitted.length !== 2) {
    return { notFound: true }
  }
  context.res.setHeader('Cache-Control', 'public, s-maxage=86400')
  const { data, error } = await apolloClient.query({
    query: PublicationDetailsDocument,
    variables: {
      request: { publicationId: pubId },
      sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID]
    }
  })
  if (!data.publication || error) {
    return { notFound: true }
  }
  return {
    props: { video: data.publication }
  }
}
