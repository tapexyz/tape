const logtailApiURL = 'https://in.logtail.com/'
const apiKey = 'YOUR_KEY_HERE'

// A list of allowed origins that can access our backend API
const allowedOrigins = ['https://lenstube.xyz', 'https://www.lenstube.xyz']

// A function that returns a set of CORS headers
const corsHeaders = (origin) => ({
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Origin': origin
})

// Check the origin for this request
// If it is included in our set of known and allowed origins, return it, otherwise
// return a known, good origin. This effectively does not allow browsers to
// continue requests if the origin they're requesting from doesn't match.
const checkOrigin = (request) => {
  const origin = request.headers.get('Origin')
  const foundOrigin = allowedOrigins.find((allowedOrigin) =>
    allowedOrigin.includes(origin)
  )
  return foundOrigin ? foundOrigin : allowedOrigins[0]
}

const postLog = async (event) => {
  const body = await event.request.body
  console.log(body)
  const request = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': `CFW`
    },
    body
  }
  await fetch(logtailApiURL, request)
  // Check that the request's origin is a valid origin, allowed to access this API
  const allowedOrigin = checkOrigin(event.request)
  return new Response(JSON.stringify({ tailed: true }), {
    headers: {
      'Content-type': 'application/json',
      ...corsHeaders(allowedOrigin)
    }
  })
}

async function handleRequest(event) {
  // If an OPTIONS request comes in, return a simple
  // response with the CORS information for our app
  if (event.request.method === 'OPTIONS') {
    // Check that the request's origin is a valid origin, allowed to access this API
    const allowedOrigin = checkOrigin(event.request)
    return new Response('OK', { headers: corsHeaders(allowedOrigin) })
  }

  // If a POST request comes in, handle it using the getImages function
  if (event.request.method === 'POST') {
    return postLog(event)
  }

  // Redirect any other requests to a different URL, such as
  // your deployed React application
  return Response.redirect('https://lenstube.xyz')
}

// Handle incoming fetch events with handleRequest function
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event))
})
