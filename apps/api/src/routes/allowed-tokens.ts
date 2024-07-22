import { ERROR_MESSAGE } from '@tape.xyz/constants'
import { db } from '@tape.xyz/server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', async (c) => {
  try {
    const results = await db.manyOrNone(
      `
       SELECT * FROM "AllowedToken";
      `
    )
    const tokens = results.map((item: Record<string, unknown>) => ({
      address: item.address,
      decimals: item.decimals,
      name: item.name,
      symbol: item.symbol
    }))

    c.header('Cache-Control', 'max-age=600')
    return c.json({ success: true, tokens })
  } catch (error) {
    console.error('[ALLOWED TOKENS] Error:', error)
    return c.json({ success: false, message: ERROR_MESSAGE })
  }
})

export default app
