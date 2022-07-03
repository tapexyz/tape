import VideoDetails from '@components/Watch'
import { nodeClient } from '@lib/apollo'
import { LENSTUBE_APP_ID } from '@utils/constants'
import { VIDEO_DETAIL_QUERY } from '@utils/gql/queries'
import { GetServerSideProps } from 'next'
import { LenstubePublication } from 'src/types/local'
import parser from 'ua-parser-js'

export default VideoDetails

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id
  const { headers } = context.req
  const { channelId } = context.req.cookies
  const ua = parser(headers['user-agent'])
  const { data, error } = await nodeClient.query({
    query: VIDEO_DETAIL_QUERY,
    variables: {
      request: { publicationId: id },
      reactionRequest: channelId ? { profileId: channelId } : null,
      sources: [LENSTUBE_APP_ID]
    }
  })
  const video = data?.publication as LenstubePublication
  if (!video || error) {
    return {
      notFound: true
    }
  }
  return {
    props: { video, ua: !!ua.os?.name }
  }
}
