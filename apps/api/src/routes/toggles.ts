import { zValidator } from '@hono/zod-validator'
import { CACHE_CONTROL, ERROR_MESSAGE } from '@tape.xyz/constants'
import { db } from '@tape.xyz/server'
import { Hono } from 'hono'
import { object, string } from 'zod'

const app = new Hono()

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
        SELECT "isSuspended", "isLimited"
        FROM "Profile"
        WHERE "profileId"  = $1
        LIMIT 1;
      `,
        [profileId]
      )

      c.header('Cache-Control', CACHE_CONTROL.FOR_FIVE_MINUTE)
      return c.json({
        success: true,
        restrictions: {
          suspended: Boolean(result?.isSuspended),
          limited: Boolean(result?.isLimited)
        }
      })
    } catch (error) {
      console.error('[TOGGLES] Error:', error)
      return c.json({ success: false, message: ERROR_MESSAGE })
    }
  }
)

export default app
