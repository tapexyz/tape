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
    // Fetch metatags directly from tape.xyz
    if (url.includes('tape.xyz/watch')) {
      const path = new URL(url).pathname
      url = `https://api.tape.xyz/metatags?path=${path}`
    }

    // Fetch metatags from URL
    const response = await fetch(url, { headers: { 'User-Agent': 'bot' } })
    const html = await response.text()
    const { document } = parseHTML(html)

    const ogData = extractOgTags(document)

    return new Response(JSON.stringify({ success: false, og: ogData }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}
