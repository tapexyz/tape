import { zValidator } from '@hono/zod-validator'
import { ALL_EVENTS } from '@tape.xyz/generic/events'
import { Hono } from 'hono'
import UAParser from 'ua-parser-js'
import type { z } from 'zod'
import { any, object, string } from 'zod'

import { ERROR_MESSAGE } from '@/helpers/constants'
import checkEventExistence from '@/helpers/tower/checkEventExistence'

type Bindings = {
  INGEST_REST_ENDPOINT: string
  IP_API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

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

    try {
      const ipResponse = await fetch(
        `https://pro.ip-api.com/json/${ip}?key=${c.env.IP_API_KEY}`
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

    const body = `
        INSERT INTO events (
          name,
          actor,
          properties,
          url,
          city,
          country,
          region,
          referrer,
          platform,
          browser,
          browser_version,
          os,
          utm_source,
          utm_medium,
          utm_campaign,
          utm_term,
          utm_content,
          fingerprint
        ) VALUES (
          '${name}',
          ${actor ? `'${actor}'` : null},
          ${properties ? `'${JSON.stringify(properties)}'` : null},
          ${url ? `'${url}'` : null},
          ${ipData?.city ? `'${ipData?.city}'` : null},
          ${ipData?.country ? `'${ipData?.country}'` : null},
          ${ipData?.regionName ? `'${ipData?.regionName}'` : null},
          ${referrer ? `'${referrer}'` : null},
          ${platform ? `'${platform}'` : null},
          ${ua.browser.name ? `'${ua.browser.name}'` : null},
          ${ua.browser.version ? `'${ua.os.version}'` : null},
          ${ua.os.name ? `'${ua.os.name}'` : null},
          ${utmSource ? `'${utmSource}'` : null},
          ${utmMedium ? `'${utmMedium}'` : null},
          ${utmCampaign ? `'${utmCampaign}'` : null},
          ${utmTerm ? `'${utmTerm}'` : null},
          ${utmContent ? `'${utmContent}'` : null},
          ${fingerprint ? `'${fingerprint}'` : null}
        )
      `

    const clickhouseResponse = await fetch(c.env.INGEST_REST_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    })

    if (clickhouseResponse.status !== 200) {
      return c.json({ success: false, message: ERROR_MESSAGE })
    }

    return c.json({ success: true })
  } catch {
    return c.json({ success: false, message: ERROR_MESSAGE })
  }
})

export default app
