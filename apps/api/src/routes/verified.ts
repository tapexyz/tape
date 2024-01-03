import { Hono } from 'hono'
import { cache } from 'hono/cache'

import { ERROR_MESSAGE } from '@/helpers/constants'

type Bindings = {
  TAPE_DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()
app.get(
  '*',
  cache({
    cacheName: 'verified',
    cacheControl: 'max-age=300'
  })
)

app.get('/', async (c) => {
  try {
    const { results } = await c.env.TAPE_DB.prepare(
      'SELECT * FROM Verified'
    ).all()
    const ids = results.map((item: Record<string, unknown>) => item.ProfileId)

    return c.json({ success: true, ids })
  } catch {
    return c.json({ success: false, message: ERROR_MESSAGE })
  }
})

export default app
