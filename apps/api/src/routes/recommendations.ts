import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { object, string } from 'zod'

import { ERROR_MESSAGE } from '@/helpers/constants'
import { k3lFeed, k3lScores } from '@/helpers/recommendations/k3l'

const app = new Hono()

app.get(
  '/:provider/:strategy/:limit?/:offset?',
  zValidator(
    'param',
    object({
      provider: string(),
      strategy: string()
    })
  ),
  async (c) => {
    const { provider, strategy, limit, offset } = c.req.param()
    const exclude = c.req.query('exclude')

    try {
      let items: string[] = []
      switch (provider) {
        case 'k3l-score':
          items = await k3lScores(strategy, limit, offset)
          break
        case 'k3l-feed':
          items = await k3lFeed(strategy, limit, offset, exclude)
          break
        default:
          return c.json({ success: false, message: 'Bad Request' })
      }

      return c.json({ success: true, items })
    } catch {
      return c.json({ success: false, message: ERROR_MESSAGE })
    }
  }
)

export default app
