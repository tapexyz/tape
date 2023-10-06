import Video from '@components/Video'
import type { Publication } from '@tape.xyz/lens'
import { PublicationDetailsDocument } from '@tape.xyz/lens'
import { apolloClient } from '@tape.xyz/lens/apollo'
import type { GetServerSideProps } from 'next'

export default Video

interface Props {
  video: Publication
}

const client = apolloClient()

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const publicationId = context.query.pubId as string
  const { data, error } = await client.query({
    query: PublicationDetailsDocument,
    variables: {
      request: { publicationId }
    }
  })
  if (!data?.publication || error) {
    return { notFound: true }
  }
  context.res.setHeader('Cache-Control', 'public, s-maxage=86400')
  return {
    props: { video: data.publication }
  }
}
