import { useQuery } from '@tanstack/react-query'
import { WORKER_NFTS_URL } from '@tape.xyz/constants'
import type { ZoraNft } from '@tape.xyz/lens/custom-types'
import axios from 'axios'

interface UseZoraNftProps {
  chain: string
  address: string
  token?: string
  enabled?: boolean
}

export const useZoraNft = ({
  chain,
  address,
  token,
  enabled
}: UseZoraNftProps): {
  data: ZoraNft
  loading: boolean
  error: unknown
} => {
  const loadNftDetails = async () => {
    const response = await axios.get(`${WORKER_NFTS_URL}/zora`, {
      params: { chain, address, token }
    })

    return response.data?.nft
  }

  const { data, isLoading, error } = useQuery(
    ['zoraNftMetadata', chain, address, token],
    () => loadNftDetails().then((res) => res),
    { enabled }
  )

  return { data, loading: isLoading, error }
}
