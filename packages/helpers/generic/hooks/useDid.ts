import { useQuery } from '@tanstack/react-query'

import { resolveDid } from '../functions/resolveDid'

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
    return data[0].length ? data[0] : address
  }

  const { data, isLoading, error } = useQuery(
    ['didResolve', address],
    () => loadDetails().then((res) => res),
    { enabled }
  )

  return { did: data, loading: isLoading, error }
}
