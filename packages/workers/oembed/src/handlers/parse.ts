import { COMMON_REGEX } from '../helpers/constants'
import extractOgTags from '../helpers/extractOgTags'
import type { WorkerRequest } from '../types'
import { parseHTML } from 'linkedom'

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

    const ogData = await extractOgTags(document, url)

    return new Response(JSON.stringify({ success: true, og: ogData }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}
