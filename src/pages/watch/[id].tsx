import VideoDetails from '@components/Watch'
import type { GetServerSideProps } from 'next'
import parser from 'ua-parser-js'

export default VideoDetails

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ua = parser(context.req?.headers['user-agent'])
  const pubId = context.params?.id
  if (!ua.os.name && pubId) {
    context.res.setHeader('Cache-Control', 'public, s-maxage=86400')
    return {
      redirect: {
        permanent: false,
        destination: `https://embed.lenstube.xyz/${pubId}`
      }
    }
  }
  return {
    props: {}
  }
}
