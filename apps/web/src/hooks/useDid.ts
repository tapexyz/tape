import { useQuery } from '@tanstack/react-query'
import { resolveDid } from '@tape.xyz/generic/functions/resolveDid'
import { shortenAddress } from '@tape.xyz/generic/functions/shortenAddress'
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
  error: unknown
  loading: boolean
} => {
  const loadDetails = async () => {
    const data = await resolveDid([address])
    let item = data[0]
    if (isAddress(item)) {
      item = shortenAddress(address)
    }
    return item.length ? item : shortenAddress(address)
  }

  const { data, error, isLoading } = useQuery({
    enabled,
    queryFn: loadDetails,
    queryKey: ['didResolve', address]
  })

  return { did: data, error, loading: isLoading }
}
