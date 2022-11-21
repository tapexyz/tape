import Video from '@components/Video'
import apolloNodeClient from '@lib/apollo'
import type { Profile } from 'lens'
import { ProfileDocument } from 'lens'
import type { GetServerSideProps } from 'next'

export default Video

interface Props {
  profile: Profile
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const handle = context.query.handle as string
  if (!handle) {
    return { notFound: true }
  }
  const { data, error } = await apolloNodeClient.query({
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
    props: { profile: data.profile }
  }
}
