import { CACHE_CONTROL, ERROR_MESSAGE } from '@tape.xyz/constants'
import { db } from '@tape.xyz/server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/profiles', async (c) => {
  try {
    const results = await db.manyOrNone(
      `
       SELECT "profileId" FROM "CuratedProfile" ORDER BY RANDOM() LIMIT 50;
      `
    )
    const ids = results.map((item: Record<string, unknown>) => item.profileId)

    c.header('Cache-Control', CACHE_CONTROL.FOR_FIVE_MINUTE)
    return c.json({ success: true, ids })
  } catch (error) {
    console.error('[CURATED PROFILES] Error:', error)
    return c.json({ success: false, message: ERROR_MESSAGE })
  }
})

export default app
