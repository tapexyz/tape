import { parseHTML } from 'linkedom'
import { COMMON_REGEX } from '../helpers/constants'
import extractOgTags from '../helpers/extractOgTags'
import type { WorkerRequest } from '../types'

export default async (request: WorkerRequest) => {
  const urlObject = new URL(request.url)
  let url = urlObject.searchParams.get('url')
  if (!url) {
    return new Response(
      JSON.stringify({ success: false, message: 'Missing URL' })
    )
  }

  try {
    if (COMMON_REGEX.TAPE_WATCH.test(url)) {
      // Fetch metatags directly from dragverse.app
      const path = new URL(url).pathname
      url = `https://api.dragverse.app/metatags?path=${path}`
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

    const ogData = await extractOgTags(document, url)

    return new Response(JSON.stringify({ success: true, og: ogData }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}
