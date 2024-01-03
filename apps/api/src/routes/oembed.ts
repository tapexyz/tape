import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { parseHTML } from 'linkedom'
import { object, string } from 'zod'

import { ERROR_MESSAGE } from '@/helpers/constants'
import extractOgTags from '@/helpers/oembed/extractOgTags'
import { COMMON_REGEX } from '@/helpers/oembed/regex'

type Bindings = {
  LIVEPEER_API_TOKEN: string
}

const app = new Hono<{ Bindings: Bindings }>()
app.get(
  '*',
  cache({
    cacheName: 'oembed',
    cacheControl: 'max-age=3600'
  })
)

const validationSchema = object({
  url: string().url()
})

app.get('/', zValidator('query', validationSchema), async (c) => {
  try {
    let url = c.req.query('url') as string

    if (COMMON_REGEX.TAPE_WATCH.test(url)) {
      // Fetch metatags directly from tape.xyz
      const path = new URL(url).pathname
      url = `https://og.tape.xyz${path}`
    }

    // Fetch metatags from URL
    const response = await fetch(url, {
      headers: { 'User-Agent': 'bot' },
      cf: {
        cacheTtl: 60 * 60 * 24 * 7,
        cacheEverything: true
      }
    })
    const html = await response.text()
    const { document } = parseHTML(html)

    const ogData = await extractOgTags(document)

    return c.json({ success: true, og: ogData })
  } catch {
    return c.json({ success: false, message: ERROR_MESSAGE })
  }
})

export default app
