import { CREATOR_VIDEO_CATEGORIES } from '@utils/data/categories'
import React from 'react'

import CategoryItem from './CategoryItem'

const Categories = () => {
  return (
    <div className="hidden gap-4 my-1 md:grid sm:grid-cols-2 lg:grid-cols-7 md:grid-cols-4">
      {CREATOR_VIDEO_CATEGORIES.map((item) => (
        <CategoryItem category={item} key={item.tag} />
      ))}
    </div>
  )
}

export default Categories
