import { IS_MAINNET, POLYGON_RPC_URL } from '@dragverse/constants';
import { createPublicClient, http } from 'viem';
import { polygon, polygonMumbai } from 'viem/chains';

export const viemPublicClient = createPublicClient({
  chain: IS_MAINNET ? polygon : polygonMumbai,
  transport: http(POLYGON_RPC_URL)
})
