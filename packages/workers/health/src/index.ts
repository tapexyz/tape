type EnvType = {
  BETTER_UPTIME_KEY: string
}

type Monitor = {
  id: string
  attributes: {
    status: string
  }
}

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json'
}

async function handleRequest(_request: Request, env: EnvType) {
  try {
    const BETTER_UPTIME_KEY = env.BETTER_UPTIME_KEY
    const response = await fetch('https://betteruptime.com/api/v2/monitors', {
      headers: {
        Authorization: `Bearer ${BETTER_UPTIME_KEY}`
      }
    })
    const uptimeRes = (await response.json()) as any
    const monitors: Monitor[] = uptimeRes.data
    const incidents = monitors.filter(
      (m: Monitor) => m.attributes.status !== 'up'
    )

    return new Response(
      JSON.stringify({
        ok: !incidents.length
      }),
      { headers }
    )
  } catch {
    return new Response(
      JSON.stringify({ ok: false, message: 'Something went wrong!' }),
      { headers }
    )
  }
}

export default {
  async fetch(request: Request, env: EnvType) {
    return await handleRequest(request, env)
  }
}
