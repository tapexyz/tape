import { UNLONELY_LIVE_DETAIL, UNLONELY_LIVE_FEED } from '../queries'

export default async (channel?: string) => {
  try {
    const result: any = await fetch(
      'https://unlonely-vqeii.ondigitalocean.app/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: channel ? UNLONELY_LIVE_DETAIL : UNLONELY_LIVE_FEED,
          variables: {
            slug: channel
          }
        })
      }
    ).then((data) => data.json())

    const { getChannelFeed, getChannelBySlug } = result?.data ?? {}

    const items = getChannelFeed?.filter((el: any) => el.isLive) ?? [
      getChannelBySlug
    ]

    let response = new Response(JSON.stringify({ success: true, items }))

    response.headers.set('Cache-Control', 'max-age=1000')
    response.headers.set('Content-Type', 'application/json')

    return response
  } catch (error) {
    throw error
  }
}
