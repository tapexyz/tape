import type { FC } from 'react'
import React from 'react'

type Props = {
  icon: React.ReactNode
  count: number
  text: string
}

const StatCard: FC<Props> = ({ icon, count, text }) => {
  return (
    <div className="dark:bg-theme space-y-3 rounded-xl bg-white bg-opacity-80 p-6 backdrop-blur-lg">
      <span className="inline-flex rounded-lg bg-gray-100 p-2 dark:bg-black">
        {icon}
      </span>
      <div>
        <h6 className="mb-1 text-3xl font-semibold opacity-90">{count}</h6>
        <div className="truncate whitespace-nowrap text-xs font-medium opacity-70">
          {text}
        </div>
      </div>
    </div>
  )
}

export default StatCard
