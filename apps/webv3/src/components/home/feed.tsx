'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

import { publicationsQuery } from './query'

export const Feed = () => {
  const { data } = useSuspenseQuery(publicationsQuery)

  console.log(data.explorePublications)

  return <div>gm gm</div>
}
