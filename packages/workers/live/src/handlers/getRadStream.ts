export default async () => {
  try {
    const item = {
      title: 'Rad',
      description: 'Rad is a live stream of curated content from the internet.',
      playback: 'https://unlonely-vqeii.ondigitalocean.app/live/rad.m3u8',
      poster: 'https://unlonely-vqeii.ondigitalocean.app/live/rad.png',
      lensHandle: 'lens/streameth'
    }
    const response = new Response(JSON.stringify({ success: true, item }))

    response.headers.set('Cache-Control', 'max-age=1000')
    response.headers.set('Content-Type', 'application/json')

    return response
  } catch (error) {
    throw error
  }
}
