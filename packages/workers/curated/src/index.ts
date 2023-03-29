import fetchData from './fetchData'

export type EnvType = {
  AIRTABLE_PAT: string
  CURATED: KVNamespace
}

export const CATEGORIES_KEY = 'categories'

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json'
}

const handleRequest = async (request: Request, env: EnvType) => {
  const url = new URL(request.url)
  const path = url.pathname.split('/').pop()

  if (!path) {
    return new Response(
      JSON.stringify({ success: false, message: 'No path specified' }),
      { headers }
    )
  }

  try {
    if (path === 'categories') {
      const curateCategories = await env.CURATED.get(CATEGORIES_KEY)
      const categories = curateCategories ? JSON.parse(curateCategories) : []
      const response = new Response(
        JSON.stringify({ success: true, categories }),
        {
          headers
        }
      )
      response.headers.set('Cache-Control', 'max-age=29000, s-maxage=29000')
      return response
    }

    const curatedChannelIds = await env.CURATED.get(path)
    const channelIds = curatedChannelIds ? JSON.parse(curatedChannelIds) : []
    const response = new Response(
      JSON.stringify({ success: true, channelIds }),
      {
        headers
      }
    )
    response.headers.set('Cache-Control', 'max-age=29000, s-maxage=29000')
    return response
  } catch {
    return new Response(
      JSON.stringify({
        success: false
      }),
      { headers }
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
