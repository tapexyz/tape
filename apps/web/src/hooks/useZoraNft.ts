import { WORKER_NFTS_URL } from '@dragverse/constants'
import type { ZoraNft } from '@dragverse/lens/custom-types'
import { useQuery } from '@tanstack/react-query'
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

  const { data, isLoading, error } = useQuery({
    queryKey: ['zoraNftMetadata', chain, address, token],
    queryFn: loadNftDetails,
    enabled
  })

  return { data, loading: isLoading, error }
}
