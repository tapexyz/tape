import { IS_MAINNET, POLYGON_RPC_URL } from '@tape.xyz/constants'
import { createPublicClient, createWalletClient, http } from 'viem'
import { polygon, polygonMumbai } from 'viem/chains'

export const viemWalletClient = createWalletClient({
  chain: IS_MAINNET ? polygon : polygonMumbai,
  transport: http(POLYGON_RPC_URL)
})

export const viemPublicClient = createPublicClient({
  chain: IS_MAINNET ? polygon : polygonMumbai,
  transport: http(POLYGON_RPC_URL)
})
