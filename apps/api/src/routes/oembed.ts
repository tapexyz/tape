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
  url: string().url(),
  format: string().optional()
})

app.get('/', zValidator('query', validationSchema), async (c) => {
  try {
    const reqUrl = c.req.url.replace(/&amp;/g, '&')
    const reqUrlParams = new URL(reqUrl).searchParams

    let url = reqUrlParams.get('url') as string
    const format = reqUrlParams.get('format') as string

    if (COMMON_REGEX.TAPE_WATCH.test(url)) {
      // Fetch metatags directly from tape.xyz
      const path = new URL(url).pathname
      url = `https://og.tape.xyz${path}`
    }

    // Fetch metatags from URL
    const response = await fetch(url, {
      headers: { 'User-Agent': 'bot' }
    })
    const html = await response.text()
    const { document } = parseHTML(html)

    const ogData = await extractOgTags(document)

    if (format === 'json') {
      return c.json(ogData)
    }

    if (format === 'xml') {
      c.res.headers.set('Content-Type', 'application/xml')
      return c.body(`<?xml version="1.0" encoding="utf-8"?>
        <oembed>
          <title>${ogData.title}</title>
          <author_name>${ogData.author_name}</author_name>
          <author_url>${ogData.author_url}</author_url>
          <type>${ogData.type}</type>
          <height>${ogData.height}</height>
          <width>${ogData.width}</width>
          <version>${ogData.version}</version>
          <provider_name>${ogData.provider_name}</provider_name>
          <provider_url>${ogData.provider_url}</provider_url>
          <thumbnail_height>${ogData.thumbnail_height}</thumbnail_height>
          <thumbnail_width>${ogData.thumbnail_width}</thumbnail_width>
          <thumbnail_url>${ogData.thumbnail_url}</thumbnail_url>
          <html>${ogData.html}</html>
        </oembed>`)
    }

    return c.json({ success: true, og: ogData })
  } catch {
    return c.json({ success: false, message: ERROR_MESSAGE })
  }
})

export default app
