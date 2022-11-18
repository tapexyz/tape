import React, { useMemo } from 'react'

import CategoryItemShimmer from './CategoryItemShimmer'

const CategoriesShimmer = () => {
  const cards = useMemo(() => Array(14).fill(1), [])

  return (
    <div className="hidden gap-4 my-1 md:grid sm:grid-cols-2 lg:grid-cols-7 md:grid-cols-4">
      {cards.map((i, idx) => (
        <CategoryItemShimmer key={`${i}_${idx}`} />
      ))}
    </div>
  )
}

export default CategoriesShimmer
