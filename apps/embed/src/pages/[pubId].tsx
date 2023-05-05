import Video from '@components/Video'
import type { Publication } from 'lens'
import { PublicationDetailsDocument } from 'lens'
import type { GetServerSideProps } from 'next'
import getApolloClient from 'utils/functions/getApolloClient'

export default Video

const apolloClient = getApolloClient()

interface Props {
  video: Publication
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const publicationId = context.query.pubId as string
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
