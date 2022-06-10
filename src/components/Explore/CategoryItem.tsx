import { Link } from 'interweave-autolink'
import React, { FC } from 'react'

type Props = {
  category: { name: string; icon: React.ReactNode }
}

const CategoryItem: FC<Props> = ({ category }) => {
  return (
    <Link href={`/explore/${category.name.toLowerCase()}`}>
      <a className="flex items-center justify-between px-4 py-2 transition duration-300 ease-in-out bg-white rounded-lg dark:bg-gray-900 md:hover:scale-105">
        <span className="truncate">{category.name}</span>
        {category.icon}
      </a>
    </Link>
  )
}

export default CategoryItem
