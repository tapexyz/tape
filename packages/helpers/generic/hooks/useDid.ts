import { useQuery } from '@tanstack/react-query'
import { isAddress } from 'viem'

import { resolveDid } from '../functions/resolveDid'
import { shortenAddress } from '../functions/shortenAddress'

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

  const { data, isLoading, error } = useQuery(
    ['didResolve', address],
    () => loadDetails().then((res) => res),
    { enabled }
  )

  return { did: data, loading: isLoading, error }
}
