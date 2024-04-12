import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import type { z } from 'zod'
import { object, string } from 'zod'

import { ERROR_MESSAGE } from '@/helpers/constants'
import validateIsStaff from '@/helpers/validateIsStaff'

type Bindings = {
  LIVEPEER_API_TOKEN: string
}

const app = new Hono<{ Bindings: Bindings }>()

const validationSchema = object({
  cid: string(),
  url: string()
})
type RequestInput = z.infer<typeof validationSchema>

app.post('/', zValidator('json', validationSchema), async (c) => {
  try {
    const accessToken = c.req.header('x-access-token') ?? ''

    if (!(await validateIsStaff(accessToken))) {
      return c.json({ success: false, message: 'Invalid access token' })
    }

    const body = await c.req.json<RequestInput>()

    const LIVEPEER_API_TOKEN = c.env.LIVEPEER_API_TOKEN
    const result = await fetch('https://livepeer.studio/api/asset/upload/url', {
      method: 'POST',
      body: JSON.stringify({ name: body.cid, url: body.url }),
      headers: {
        Authorization: `Bearer ${LIVEPEER_API_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Tape.xyz'
      }
    })
    const response = (await result.json()) as any

    if (!response.asset) {
      return c.json({ success: false, response })
    }

    return c.json({ success: true, assetId: response.asset.id })
  } catch {
    return c.json({ success: false, message: ERROR_MESSAGE })
  }
})

export default app
