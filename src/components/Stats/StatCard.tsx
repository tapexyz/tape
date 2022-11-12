import React, { FC } from 'react'

type Props = {
  icon: React.ReactNode
  count: number
  text: string
}

const StatCard: FC<Props> = ({ icon, count, text }) => {
  return (
    <div className="p-6 space-y-3 bg-gray-100 rounded-xl dark:bg-theme">
      <span className="inline-flex p-2 bg-white rounded-lg dark:bg-theme">
        {icon}
      </span>
      <div>
        <h6 className="mb-1 text-3xl font-semibold opacity-90">{count}</h6>
        <div className="text-xs font-medium truncate opacity-70 whitespace-nowrap">
          {text}
        </div>
      </div>
    </div>
  )
}

export default StatCard
