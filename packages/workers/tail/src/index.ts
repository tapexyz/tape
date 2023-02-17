export interface Env {
  LOGTAIL_API_KEY: string
}

const logtailApiURL = 'https://in.logtail.com/'
// A list of allowed origins that can access our backend API
const allowedOrigins = ['https://lenstube.xyz', 'https://www.lenstube.xyz']

// A function that returns a set of CORS headers
const corsHeaders = (origin: string) => ({
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Origin': origin
})

// Check the origin for this request
// If it is included in our set of known and allowed origins, return it, otherwise
// return a known, good origin. This effectively does not allow browsers to
// continue requests if the origin they're requesting from doesn't match.
const checkOrigin = (request: Request) => {
  const origin = request.headers.get('Origin') ?? ''
  const foundOrigin = allowedOrigins.find((allowedOrigin) =>
    allowedOrigin.includes(origin)
  )
  return foundOrigin ? foundOrigin : allowedOrigins[0]
}

const postLog = async (request: Request, env: Env) => {
  const body = request.body
  const allowedOrigin = checkOrigin(request)
  const headers = {
    'Content-type': 'application/json',
    ...corsHeaders(allowedOrigin)
  }
  try {
    await fetch(logtailApiURL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.LOGTAIL_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': `CFW`
      },
      body
    })
    // Check that the request's origin is a valid origin, allowed to access this API
    return new Response(JSON.stringify({ tailed: true }), { headers })
  } catch (error) {
    return new Response(JSON.stringify({ tailed: false }), { headers })
  }
}

const handleRequest = async (request: Request, env: Env) => {
  // If an OPTIONS request comes in, return a simple
  // response with the CORS information for our app
  if (request.method === 'OPTIONS') {
    // Check that the request's origin is a valid origin, allowed to access this API
    const allowedOrigin = checkOrigin(request)
    return new Response('OK', { headers: corsHeaders(allowedOrigin) })
  }

  // If a POST request comes in, handle it using the getImages function
  if (request.method === 'POST') {
    return postLog(request, env)
  }

  // Redirect any other requests to a different URL, such as
  // your deployed React application
  return Response.redirect('https://lenstube.xyz')
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return await handleRequest(request, env)
  }
}
