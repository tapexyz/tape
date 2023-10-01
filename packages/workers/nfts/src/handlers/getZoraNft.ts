import { WorkerRequest } from '../types'

const ZORA_MAINNET_CHAINS = ['eth', 'oeth', 'base', 'zora']

export default async (request: WorkerRequest) => {
  const { chain, address, token } = request.query

  if (!chain || !address) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'No chain and address provided'
      })
    )
  }

  try {
    const network = ZORA_MAINNET_CHAINS.includes(chain as string)
      ? ''
      : 'testnet.'
    const zoraResponse = await fetch(
      `https://${network}zora.co/api/personalize/collection/${chain}:${address}/${
        token || ''
      }`
    )
    const nft: { collection: any } = await zoraResponse.json()

    return new Response(
      JSON.stringify({ success: true, nft: nft.collection || null })
    )
  } catch (error) {
    throw error
  }
}
