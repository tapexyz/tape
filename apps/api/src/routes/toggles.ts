import { zValidator } from '@hono/zod-validator'
import { CACHE_CONTROL, ERROR_MESSAGE, REDIS_KEYS } from '@tape.xyz/constants'
import { db, rGet, rSet } from '@tape.xyz/server'
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
    c.header('Cache-Control', CACHE_CONTROL.FOR_FIVE_MINUTE)

    const cacheKey = `${REDIS_KEYS.PROFILE_TOGGLES}:${profileId}`
    const cachedValue = await rGet(cacheKey)
    if (cachedValue) {
      console.info('CACHE HIT')
      return c.json({ success: true, toggles: JSON.parse(cachedValue) })
    }
    console.info('CACHE MISS')

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
      const toggles = {
        suspended: Boolean(result?.isSuspended),
        limited: Boolean(result?.isLimited)
      }

      await rSet(cacheKey, JSON.stringify(toggles))
      return c.json({
        success: true,
        toggles
      })
    } catch (error) {
      console.error('[TOGGLES] Error:', error)
      return c.json({ success: false, message: ERROR_MESSAGE })
    }
  }
)

export default app
