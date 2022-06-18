import { LENSTUBE_TWITTER_HANDLE, LENSTUBE_URL } from '@utils/constants'
import getProfilePicture from '@utils/functions/getProfilePicture'
import { NextRequest } from 'next/server'
import { Profile } from 'src/types'
import parser from 'ua-parser-js'

export async function middleware(req: NextRequest) {
  const { headers } = req
  const url = req.nextUrl.clone()
  const channelName = url.pathname.replace('/', '')
  const ua = parser(headers.get('user-agent')!)

  if (!ua.os.name) {
    const result = await fetch(`${url.origin}/api/channel?name=${channelName}`)
    const data = await result.json()
    const channel: Profile = data?.channel
    if (data?.success) {
      const handle = `${channel?.handle} - Lenstube`
      const bio = channel.bio || 'Lenstube channel'
      const pfp = getProfilePicture(channel)
      return new Response(
        `<!DOCTYPE html>
        <html lang="en">
            <head>
            <title>${handle}</title>
            <meta name="description" content="${bio}" />
            <meta property="og:url" content=${LENSTUBE_URL} />
            <meta property="og:site_name" content="Lenstube" />
            <meta property="og:title" content="${handle}" />
            <meta property="og:description" content="${bio}" />
            <meta property="og:image" content="${pfp}" />
            <meta property="og:image:width" content="400" />
            <meta property="og:image:height" content="400" />
            <meta property="twitter:card" content="summary" />
            <meta property="twitter:site" content="Lenstube" />
            <meta property="twitter:title" content="${handle}" />
            <meta property="twitter:description" content="${bio}" />
            <meta property="twitter:image:src" content="${pfp}" />
            <meta property="twitter:image:width" content="400" />
            <meta property="twitter:image:height" content="400" />
            <meta property="twitter:creator" content="${LENSTUBE_TWITTER_HANDLE}" />
            </head>
        </html>`,
        {
          headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 's-maxage=31536000'
          }
        }
      )
    }
  }
}
