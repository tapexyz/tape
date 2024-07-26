import { CACHE_CONTROL, ERROR_MESSAGE } from '@tape.xyz/constants'
import { db } from '@tape.xyz/server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', async (c) => {
  try {
    const results = await db.manyOrNone(
      `
       SELECT * FROM "Verified";
      `
    )

    const ids = results.map((item: Record<string, unknown>) => item.profileId)

    c.header('Cache-Control', CACHE_CONTROL.FOR_FIVE_MINUTE)
    return c.json({ success: true, ids })
  } catch (error) {
    console.error('[VERIFIED] Error:', error)
    return c.json({ success: false, message: ERROR_MESSAGE })
  }
})

export default app
