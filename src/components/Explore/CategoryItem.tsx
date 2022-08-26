import { CREATOR_VIDEO_CATEGORIES } from '@utils/data/categories'
import Link from 'next/link'
import React, { FC } from 'react'

type Props = {
  category: typeof CREATOR_VIDEO_CATEGORIES[0]
}

const CategoryItem: FC<Props> = ({ category }) => {
  return (
    <Link href={`/explore/${category.tag.toLowerCase()}`}>
      <a className="flex items-center justify-between w-full p-5 transition duration-300 ease-in-out rounded-lg bg-gray-50 dark:bg-[#181818] md:hover:scale-105">
        <span className="truncate">{category.name}</span>
      </a>
    </Link>
  )
}

export default CategoryItem
