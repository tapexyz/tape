import ViewProfile from '@components/Profile'
import { HANDLE_PREFIX } from '@tape.xyz/constants'
import type { Profile, ProfileRequest } from '@tape.xyz/lens'
import { ProfileDocument } from '@tape.xyz/lens'
import { apolloClient } from '@tape.xyz/lens/apollo'
import type { GetServerSideProps } from 'next'

export default ViewProfile

const client = apolloClient()

interface Props {
  profile: Profile
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const handle = context.query.handle as string
  const id = context.query.id as string
  const forHandle = id ? id : `${HANDLE_PREFIX}${handle}`
  const { data, error } = await client.query({
    query: ProfileDocument,
    variables: {
      request: { forHandle } as ProfileRequest
    }
  })
  const profile: Profile = data?.profile

  if (!profile || error) {
    return { notFound: true }
  }
  context.res.setHeader('Cache-Control', 'public, s-maxage=86400')
  return {
    props: { profile }
  }
}
