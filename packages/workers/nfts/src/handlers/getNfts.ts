import { error } from 'itty-router'
import { Env } from '../types'
import { NFTS_QUERY } from '../queries'

export default async (
  env: Env,
  handle: string,
  limit: string,
  cursor?: string
) => {
  if (!handle) {
    return error(400, 'Bad request!')
  }
  try {
    const result: any = await fetch(env.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: env.API_KEY
      },
      body: JSON.stringify({
        query: NFTS_QUERY,
        variables: { owner: handle, limit, cursor }
      })
    }).then((data) => data.json())

    const { Ethereum, Polygon } = result?.data ?? {}
    const { TokenBalance: EthereumTokenBalance, pageInfo: EthereumPageInfo } =
      Ethereum ?? {}
    const { TokenBalance: PolygonTokenBalance, pageInfo: PolygonPageInfo } =
      Polygon ?? {}

    const items = [
      ...(EthereumTokenBalance ?? [])
        .map(({ tokenNfts }: any) => tokenNfts)
        .filter(
          ({ contentValue }: any) => contentValue.video || contentValue.audio
        ),
      ...(PolygonTokenBalance ?? [])
        .map(({ tokenNfts }: any) => tokenNfts)
        .filter(
          ({ contentValue }: any) => contentValue.video || contentValue.audio
        )
    ]

    let response = new Response(JSON.stringify({ success: true, items }))

    response.headers.set('Cache-Control', 'max-age=1000')
    response.headers.set('Content-Type', 'application/json')

    return response
  } catch (error) {
    throw error
  }
}
