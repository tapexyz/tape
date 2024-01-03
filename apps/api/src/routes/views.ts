import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { object, z } from 'zod'

import { ERROR_MESSAGE } from '@/helpers/constants'

type Bindings = {
  LIVEPEER_API_TOKEN: string
}

const app = new Hono<{ Bindings: Bindings }>()
const corsConfig = {
  origin: ['https://tape.xyz', 'https://www.tape.xyz'],
  allowHeaders: ['*'],
  allowMethods: ['POST', 'OPTIONS'],
  maxAge: 600
}
app.use('*', cors(corsConfig))

const validationSchema = object({
  cid: z.string()
})
type RequestInput = z.infer<typeof validationSchema>

app.post('/', zValidator('json', validationSchema), async (c) => {
  try {
    const body = await c.req.json<RequestInput>()

    const LIVEPEER_API_TOKEN = c.env.LIVEPEER_API_TOKEN
    const result = await fetch(
      `https://livepeer.studio/api/data/views/query/total/${body.cid}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${LIVEPEER_API_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Tape'
        }
      }
    )
    const viewsRes = (await result.json()) as any

    if (!viewsRes.viewCount) {
      return c.json({ success: false, views: 0 })
    }

    return c.json({ success: true, views: viewsRes.viewCount })
  } catch {
    return c.json({ success: false, message: ERROR_MESSAGE })
  }
})

export default app
