import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { object, string } from 'zod'

import { ERROR_MESSAGE } from '@/helpers/constants'

import db from '../../db/config'

const app = new Hono()
app.get(
  '*',
  cache({
    cacheName: 'verified',
    cacheControl: 'max-age=300'
  })
)

app.get(
  '/:profileId',
  zValidator(
    'param',
    object({
      profileId: string()
    })
  ),
  async (c) => {
    const { profileId } = c.req.param()

    try {
      const result = await db.oneOrNone(
        `
        SELECT suspended, limited, flagged
        FROM "ProfileRestriction"
        WHERE "profileId"  = $1
        LIMIT 1;
      `,
        [profileId]
      )

      return c.json({
        success: true,
        restrictions: {
          suspended: Boolean(result?.suspended),
          limited: Boolean(result?.limited),
          flagged: Boolean(result?.flagged)
        }
      })
    } catch {
      return c.json({ success: false, message: ERROR_MESSAGE })
    }
  }
)

export default app
