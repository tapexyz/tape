import { Hono } from 'hono'
import { cache } from 'hono/cache'

import { ERROR_MESSAGE } from '@/helpers/constants'

import db from '../db/config'

const app = new Hono()
app.get(
  '*',
  cache({
    cacheName: 'verified',
    cacheControl: 'max-age=300'
  })
)

app.get('/', async (c) => {
  try {
    const results = await db.manyOrNone(
      `
       SELECT * FROM "Verified";
      `
    )

    const ids = results.map((item: Record<string, unknown>) => item.profileId)

    return c.json({ success: true, ids })
  } catch {
    return c.json({ success: false, message: ERROR_MESSAGE })
  }
})

export default app
