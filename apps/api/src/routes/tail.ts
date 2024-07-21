import { zValidator } from '@hono/zod-validator'
import { ERROR_MESSAGE } from '@tape.xyz/constants'
import { Hono } from 'hono'
import type { z } from 'zod'
import { object, string } from 'zod'

const app = new Hono()

const logtailApiURL = 'https://in.logtail.com/'
const validationSchema = object({
  source: string(),
  level: string().nullable().optional(),
  message: string().nullable().optional()
})
type RequestInput = z.infer<typeof validationSchema>

app.post('/', zValidator('json', validationSchema), async (c) => {
  try {
    const body = await c.req.json<RequestInput>()
    const LOGTAIL_API_KEY = process.env.LOGTAIL_API_KEY!
    const result = await fetch(logtailApiURL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOGTAIL_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Tape'
      },
      body: JSON.stringify(body)
    })
    if (!result.ok) {
      return c.json({ success: false, message: ERROR_MESSAGE })
    }
    return c.json({ success: true })
  } catch {
    return c.json({ success: false, message: ERROR_MESSAGE })
  }
})

export default app
