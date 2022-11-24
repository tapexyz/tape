import Channel from '@components/Channel'
import type { Profile } from 'lens'
import { ProfileDocument } from 'lens'
import type { GetServerSideProps } from 'next'
import getApolloClient from 'utils/functions/getApolloClient'

export default Channel

interface Props {
  channel: Profile
}

const apolloClient = getApolloClient()

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const handle = context.query.handle as string
  if (!handle) {
    return { notFound: true }
  }
  const { data, error } = await apolloClient.query({
    query: ProfileDocument,
    variables: {
      request: { handle }
    }
  })
  if (!data.profile || error) {
    return { notFound: true }
  }
  context.res.setHeader('Cache-Control', 'public, s-maxage=86400')
  return {
    props: { channel: data.profile }
  }
}
