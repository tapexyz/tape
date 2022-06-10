import React from 'react'

import CategoryItemShimmer from './CategoryItemShimmer'

const CategoriesShimmer = () => {
  return (
    <div className="hidden gap-4 my-1 md:grid sm:grid-cols-2 lg:grid-cols-7 md:grid-cols-4">
      <CategoryItemShimmer />
      <CategoryItemShimmer />
      <CategoryItemShimmer />
      <CategoryItemShimmer />
      <CategoryItemShimmer />
      <CategoryItemShimmer />
      <CategoryItemShimmer />
    </div>
  )
}

export default CategoriesShimmer
