import fetchData from './fetchData'

export type EnvType = {
  AIRTABLE_PAT: string
  CURATED: KVNamespace
}

export const CATEGORIES_KEY = 'categories'

const handleRequest = async (request: Request, env: EnvType) => {
  const url = new URL(request.url)
  const path = url.pathname.split('/').pop()

  if (!path) {
    return new Response(
      JSON.stringify({ success: false, message: 'No path specified' })
    )
  }

  try {
    const headers = new Headers()
    headers.set('Cache-Control', 'max-age=18000')

    if (path === 'categories') {
      const curateCategories = await env.CURATED.get(CATEGORIES_KEY)
      const categories = curateCategories ? JSON.parse(curateCategories) : []
      return new Response(JSON.stringify({ success: true, categories }), {
        headers
      })
    }

    const curatedChannelIds = await env.CURATED.get(path)
    const channelIds = curatedChannelIds ? JSON.parse(curatedChannelIds) : []
    return new Response(JSON.stringify({ success: true, channelIds }), {
      headers
    })
  } catch {
    return new Response(
      JSON.stringify({
        success: false
      })
    )
  }
}

export default {
  async fetch(request: Request, env: EnvType) {
    return await handleRequest(request, env)
  },
  async scheduled(request: Request, env: EnvType) {
    return await fetchData(request, env)
  }
}
