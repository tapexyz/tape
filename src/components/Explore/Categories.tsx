import { WEB_VIEW_CATEGORIES } from '@utils/data/categories'
import React from 'react'

import CategoryItem from './CategoryItem'

const Categories = () => {
  return (
    <div className="hidden gap-4 my-1 md:grid sm:grid-cols-2 lg:grid-cols-7 md:grid-cols-4">
      {WEB_VIEW_CATEGORIES.map((category) => (
        <CategoryItem category={category} key={category.name} />
      ))}
    </div>
  )
}

export default Categories
