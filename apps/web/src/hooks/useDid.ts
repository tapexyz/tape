import { resolveDid } from '@dragverse/generic/functions/resolveDid'
import { shortenAddress } from '@dragverse/generic/functions/shortenAddress'
import { useQuery } from '@tanstack/react-query'
import { isAddress } from 'viem'

interface UseDidProps {
  address: string
  enabled?: boolean
}

export const useDid = ({
  address,
  enabled
}: UseDidProps): {
  did: string
  loading: boolean
  error: unknown
} => {
  const loadDetails = async () => {
    const data = await resolveDid([address])
    let item = data[0]
    if (isAddress(item)) {
      item = shortenAddress(address)
    }
    return item.length ? item : shortenAddress(address)
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['didResolve', address],
    queryFn: loadDetails,
    enabled
  })

  return { did: data, loading: isLoading, error }
}
