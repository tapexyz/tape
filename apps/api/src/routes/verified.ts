import { ERROR_MESSAGE } from '@tape.xyz/constants'
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

    c.header('Cache-Control', 'max-age=300')
    return c.json({ success: true, ids })
  } catch {
    return c.json({ success: false, message: ERROR_MESSAGE })
  }
})

export default app
