import { Env } from './types'
import { ZORA_NFTS_QUERY } from './queries'

export default async () => {
  try {
    const result: any = await fetch('https://api.zora.co/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: ZORA_NFTS_QUERY,
        variables: { limit: 10 }
      })
    }).then((data) => data.json())

    const { tokens } = result?.data ?? {}
    let response = new Response(
      JSON.stringify({
        success: Boolean(tokens?.nodes),
        items: tokens?.nodes,
        error: result?.errors
      })
    )

    response.headers.set('Cache-Control', 'max-age=1000')
    response.headers.set('Content-Type', 'application/json')

    return response
  } catch (error) {
    throw error
  }
}
