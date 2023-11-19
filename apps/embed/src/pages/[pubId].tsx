import Publication from '@components/Publication'
import { getPublication, isListenable, isWatchable } from '@dragverse/generic'
import type { AnyPublication, PublicationRequest } from '@dragverse/lens'
import { PublicationDocument } from '@dragverse/lens'
import { apolloClient } from '@dragverse/lens/apollo'
import type { GetServerSideProps } from 'next'

export default Publication

interface Props {
  publication: AnyPublication
}

const client = apolloClient()

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const publicationId = context.query.pubId as string
  const { data, error } = await client.query({
    query: PublicationDocument,
    variables: {
      request: { forId: publicationId } as PublicationRequest
    }
  })
  if (!data?.publication || error) {
    return { notFound: true }
  }

  const target = getPublication(data?.publication)
  const isAudio = isListenable(target)
  const isVideo = isWatchable(target)

  if (!isAudio && !isVideo) {
    return { notFound: true }
  }

  context.res.setHeader('Cache-Control', 'public, s-maxage=86400')
  return {
    props: { publication: data.publication }
  }
}
