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
    cacheName: 'allowed-tokens',
    cacheControl: 'max-age=600' // 10 mins
  })
)

app.get('/', async (c) => {
  try {
    const { results } = await c.env.TAPE_DB.prepare(
      'SELECT * FROM AllowedToken'
    ).all()
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
