import extractOgTags from '../helpers/extractOgTags'
import type { WorkerRequest } from '../types'
import { parseHTML } from 'linkedom'

export default async (request: WorkerRequest) => {
  const url = new URL(request.url).searchParams.get('url')
  if (!url) {
    return new Response('Missing URL', { status: 400 })
  }

  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'bot' } })
    const html = await response.text()
    const { document } = parseHTML(html)

    const ogData = extractOgTags(document)

    return new Response(JSON.stringify(ogData), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}
