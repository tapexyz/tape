'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { getPublication } from '@tape.xyz/generic'
import type { AnyPublication } from '@tape.xyz/lens/gql'
import { useParams } from 'next/navigation'

import { publicationQuery } from './query'

export const Publication = () => {
  const { id } = useParams<{ id: string }>()

  const { data } = useSuspenseQuery(publicationQuery(id))
  const publication = getPublication(data.publication as AnyPublication)

  return <div>{publication.id}</div>
}
