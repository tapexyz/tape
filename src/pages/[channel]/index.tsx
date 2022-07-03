import Channel from '@components/Channel'
import { nodeClient } from '@lib/apollo'
import { PROFILE_QUERY } from '@utils/gql/queries'
import { GetServerSideProps } from 'next'
import { Profile } from 'src/types'
import parser from 'ua-parser-js'

export default Channel

export const getServerSideProps: GetServerSideProps = async (context) => {
  const channelName = context.params?.channel
  const { headers } = context.req
  const ua = parser(headers['user-agent'])
  const { data, error } = await nodeClient.query({
    query: PROFILE_QUERY,
    variables: { request: { handles: channelName } }
  })
  const channel: Profile = data?.profiles?.items[0]
  if (!data || error || data?.profiles?.items?.length === 0) {
    return {
      notFound: true
    }
  }
  return {
    props: { channel, ua: !!ua.os.name }
  }
}
