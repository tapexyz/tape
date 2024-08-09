import { zValidator } from '@hono/zod-validator'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import {
  CACHE_CONTROL,
  LENSHUB_PROXY_ADDRESS,
  POLYGON_RPC_URLS
} from '@tape.xyz/constants'
import { Hono } from 'hono'
import { createPublicClient, fallback, http } from 'viem'
import { polygon } from 'viem/chains'
import { object, string } from 'zod'

const app = new Hono()

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
        transport: fallback(POLYGON_RPC_URLS.map((rpc) => http(rpc)))
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
      c.header('Cache-Control', CACHE_CONTROL.FOR_ONE_YEAR)

      return c.body(svgImage)
    } catch (error: any) {
      console.error('[AVATAR] Error:', profileId, error?.message)
      return c.redirect(`https://cdn.stamp.fyi/avatar/${profileId}?s=300`)
    }
  }
)

export default app
