import { UNLONELY_LIVE_FEED } from '../queries'

export default async () => {
  try {
    const result: any = await fetch(
      'https://unlonely-vqeii.ondigitalocean.app/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: UNLONELY_LIVE_FEED
        })
      }
    ).then((data) => data.json())

    const { getChannelFeed } = result?.data ?? {}

    const items = getChannelFeed?.filter((el: any) => el.isLive) ?? []

    let response = new Response(JSON.stringify({ success: true, items }))

    response.headers.set('Cache-Control', 'max-age=1000')
    response.headers.set('Content-Type', 'application/json')

    return response
  } catch (error) {
    console.log('🚀 ~ file: getUnlonelyStream.ts:34 ~ error:', error)
    throw error
  }
}
