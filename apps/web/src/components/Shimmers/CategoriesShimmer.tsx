import React, { useMemo } from 'react'

import CategoryItemShimmer from './CategoryItemShimmer'

const CategoriesShimmer = () => {
  const cards = useMemo(() => Array(14).fill(1), [])

  return (
    <div className="my-1 hidden gap-4 sm:grid-cols-2 md:grid md:grid-cols-4 lg:grid-cols-7">
      {cards.map((i, idx) => (
        <CategoryItemShimmer key={`${i}_${idx}`} />
      ))}
    </div>
  )
}

export default CategoriesShimmer
