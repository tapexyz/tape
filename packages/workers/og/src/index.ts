async function handleRequest(request: Request) {
  const userAgent = request.headers.get('User-Agent') || ''
  const regex =
    /bot|telegram|baidu|bing|yandex|iframely|whatsapp|metainspector/i

  if (regex.test(userAgent)) {
    const url = new URL(request.url)
    const path = url.pathname
    const fetchUrl = `https://api.lenstube.xyz/metatags?path=${path}`
    return fetch(fetchUrl)
  }

  return fetch(request)
}

export default {
  async fetch(request: Request) {
    return await handleRequest(request)
  }
}
