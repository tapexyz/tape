import React, { FC } from 'react'

type Props = {
  icon: React.ReactNode
  count: number
  text: string
}

const StatCard: FC<Props> = ({ icon, count, text }) => {
  return (
    <div className="p-6 space-y-3 w-44 bg-gray-100 rounded-xl dark:bg-[#181818]">
      <span className="inline-flex p-2 bg-white rounded-lg">{icon}</span>
      <div>
        <h6 className="mb-1 text-3xl font-semibold">{count}</h6>
        <div className="text-xs font-medium opacity-70">{text}</div>
      </div>
    </div>
  )
}

export default StatCard
