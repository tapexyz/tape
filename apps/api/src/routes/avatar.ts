import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { createPublicClient, http } from 'viem'
import { polygon } from 'viem/chains'
import { object, string } from 'zod'

import {
  LENSHUB_PROXY_ABI,
  LENSHUB_PROXY_ADDRESS,
  POLYGON_RPC_URL
} from '@/helpers/constants'

const app = new Hono()
app.get(
  '*',
  cache({
    cacheName: 'avatar',
    cacheControl: 'max-age=300'
  })
)

app.get(
  '/:profileId',
  zValidator(
    'param',
    object({
      profileId: string()
    })
  ),
  async (c) => {
    const { profileId } = c.req.param()

    try {
      const client = createPublicClient({
        chain: polygon,
        transport: http(POLYGON_RPC_URL)
      })

      const data: any = await client.readContract({
        abi: LENSHUB_PROXY_ABI,
        address: LENSHUB_PROXY_ADDRESS,
        args: [profileId],
        functionName: 'tokenURI'
      })

      const jsonData = JSON.parse(
        Buffer.from(data.split(',')[1], 'base64').toString()
      )
      const base64Image = jsonData.image.split(';base64,').pop()
      const svgImage = Buffer.from(base64Image, 'base64').toString('utf-8')

      c.header('Content-Type', 'image/svg+xml')
      return c.body(svgImage)
    } catch {
      return c.redirect(`https://cdn.stamp.fyi/avatar/${profileId}?s=300`)
    }
  }
)

export default app
