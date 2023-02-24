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
    const payload = await request.json()

    if (!payload.sourceUrl) {
      return new Response(
        JSON.stringify({ success: false, message: 'No source provided' }),
        { headers }
      )
    }

    const data = await fetch(
      `https://livepeer.studio/api/asset?sourceUrl=${payload.sourceUrl}&phase=ready&limit=1&order=createdAt-false`,
      {
        headers: {
          Authorization: `Bearer ${env.LIVEPEER_API_TOKEN}`
        }
      }
    )
    const assetRes = await data.json()

    if (assetRes && assetRes?.length) {
      const response = await fetch(
        `https://livepeer.studio/api/data/views/${
          assetRes[assetRes.length - 1].id
        }/total`,
        {
          headers: {
            Authorization: `Bearer ${env.LIVEPEER_API_TOKEN}`
          }
        }
      )
      const viewsRes = await response.json()

      if (!viewsRes || !viewsRes?.length) {
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
          views: viewsRes[0].startViews
        }),
        {
          headers
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        views: 0
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
