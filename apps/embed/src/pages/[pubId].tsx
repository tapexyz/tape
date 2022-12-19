import Video from '@components/Video'
import { PublicationDetailsDocument } from 'lens'
import type { GetServerSideProps } from 'next'
import type { LenstubePublication } from 'utils'
import getApolloClient from 'utils/functions/getApolloClient'

export default Video

const apolloClient = getApolloClient()

interface Props {
  video: LenstubePublication
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const publicationId = context.query.pubId as string
  const splitted = publicationId.split('-')
  if (splitted.length !== 2) {
    return { notFound: true }
  }
  context.res.setHeader('Cache-Control', 'public, s-maxage=86400')
  const { data, error } = await apolloClient.query({
    query: PublicationDetailsDocument,
    variables: {
      request: { publicationId }
    }
  })
  if (!data.publication || error) {
    return { notFound: true }
  }
  return {
    props: { video: data.publication }
  }
}
