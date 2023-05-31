import React from 'react'

type Props = {
  count: number
  text: string
}

const StatCard: React.FC<Props> = ({ count, text }) => {
  return (
    <div className="bg-theme space-y-3 rounded-xl bg-white bg-opacity-80 p-6 backdrop-blur-lg">
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
