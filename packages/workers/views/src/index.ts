export interface Env {
  LIVEPEER_API_TOKEN: string
}

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
}

const handleRequest = async (request: Request, env: Env) => {
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Only POST requests are supported'
      }),
      {
        headers
      }
    )
  }
  try {
    const payload = (await request.json()) as any

    if (!payload.cid) {
      return new Response(
        JSON.stringify({ success: false, message: 'No asset cid provided' }),
        { headers }
      )
    }

    const response = await fetch(
      `https://livepeer.studio/api/data/views/query/total/${payload.cid}`,
      {
        headers: {
          Authorization: `Bearer ${env.LIVEPEER_API_TOKEN}`
        }
      }
    )
    const viewsRes = (await response.json()) as any

    if (!viewsRes.viewCount) {
      return new Response(
        JSON.stringify({
          success: true,
          views: 0
        }),
        {
          headers
        }
      )
    }
    return new Response(
      JSON.stringify({
        success: true,
        views: viewsRes.viewCount
      }),
      {
        headers
      }
    )
  } catch {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Something went wrong!',
        views: 0
      }),
      { headers }
    )
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return await handleRequest(request, env)
  }
}
