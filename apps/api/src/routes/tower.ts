import { zValidator } from '@hono/zod-validator'
import { ERROR_MESSAGE, TOWER_EVENTS_REDIS_KEY } from '@tape.xyz/constants'
import { ALL_EVENTS } from '@tape.xyz/generic/events'
import { rSave } from '@tape.xyz/server'
import { Hono } from 'hono'
import { UAParser } from 'ua-parser-js'
import type { z } from 'zod'
import { any, object, string } from 'zod'

import { checkEventExistence } from '@/helpers/tower/checkEventExistence'

const app = new Hono()

const validationSchema = object({
  name: string().min(1, { message: 'Name is required' }),
  actor: string().nullable().optional(),
  url: string(),
  referrer: string().nullable().optional(),
  platform: string(),
  fingerprint: string().nullable().optional(),
  properties: any()
})
type RequestInput = z.infer<typeof validationSchema>

app.post('/', zValidator('json', validationSchema), async (c) => {
  try {
    const reqBody = await c.req.json<RequestInput>()

    const { name, actor, url, referrer, platform, properties, fingerprint } =
      reqBody as RequestInput

    if (!checkEventExistence(ALL_EVENTS, name)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid event' })
      )
    }

    const ip = c.req.header('cf-connecting-ip')
    const user_agent = c.req.header('user-agent')

    const parser = new UAParser(user_agent || '')
    const ua = parser.getResult()
    let ipData: {
      city: string
      country: string
      regionName: string
    } | null = null

    const IP_API_KEY = process.env.IP_API_KEY!
    try {
      const ipResponse = await fetch(
        `https://pro.ip-api.com/json/${ip}?key=${IP_API_KEY}`
      )
      ipData = (await ipResponse.json()) as any
    } catch {}

    // Extract UTM parameters
    const parsedUrl = new URL(url)
    const utmSource = parsedUrl.searchParams.get('utm_source') || null
    const utmMedium = parsedUrl.searchParams.get('utm_medium') || null
    const utmCampaign = parsedUrl.searchParams.get('utm_campaign') || null
    const utmTerm = parsedUrl.searchParams.get('utm_term') || null
    const utmContent = parsedUrl.searchParams.get('utm_content') || null

    const value = {
      name,
      actor: actor || null,
      properties: properties || null,
      url: url || null,
      city: ipData?.city || null,
      country: ipData?.country || null,
      region: ipData?.regionName || null,
      referrer: referrer || null,
      platform: platform || null,
      browser: ua.browser.name || null,
      browser_version: ua.browser.version || null,
      os: ua.os.name || null,
      utm_source: utmSource || null,
      utm_medium: utmMedium || null,
      utm_campaign: utmCampaign || null,
      utm_term: utmTerm || null,
      utm_content: utmContent || null,
      fingerprint: fingerprint || null
    }

    await rSave(TOWER_EVENTS_REDIS_KEY, JSON.stringify(value))

    return c.json({ success: true })
  } catch (error) {
    console.error('[TOWER] Error:', error)
    return c.json({ success: false, message: ERROR_MESSAGE })
  }
})

export default app
