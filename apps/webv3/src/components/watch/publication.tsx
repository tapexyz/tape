import { useQuery } from '@tanstack/react-query'
import { getPublication } from '@tape.xyz/generic'
import type { AnyPublication } from '@tape.xyz/lens/gql'
import { useParams } from 'next/navigation'

import { publicationQuery } from './query'

export const Publication = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useQuery(publicationQuery(id))
  const publication = getPublication(data?.publication as AnyPublication)

  if (isLoading) {
    return <div>Loading...</div>
  }

  return <div>{publication.id}</div>
}
