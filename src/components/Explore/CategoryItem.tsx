import React, { FC } from 'react'

type Props = {
  category: { name: string; icon: React.ReactNode }
}

const CategoryItem: FC<Props> = ({ category }) => {
  return (
    <button className="flex items-center justify-between px-4 py-2 transition duration-300 ease-in-out bg-white dark:bg-gray-900 md:hover:scale-105 rounded-xl">
      <span className="truncate">{category.name}</span>
      {category.icon}
    </button>
  )
}

export default CategoryItem
