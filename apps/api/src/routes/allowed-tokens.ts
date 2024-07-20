import { Hono } from 'hono'
import { cache } from 'hono/cache'

import { ERROR_MESSAGE } from '@/helpers/constants'

import db from '../../db/config'

const app = new Hono()
app.get(
  '*',
  cache({
    cacheName: 'allowed-tokens',
    cacheControl: 'max-age=600' // 10 mins
  })
)

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

    return c.json({ success: true, tokens })
  } catch {
    return c.json({ success: false, message: ERROR_MESSAGE })
  }
})

export default app
