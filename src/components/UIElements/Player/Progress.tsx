import usePlayerStore from '@lib/store/player'
import React from 'react'

const Progress = () => {
  const { duration, currentTime } = usePlayerStore()
  const percent = ((currentTime / duration) * 100).toFixed(2)

  return (
    <div className="h-1 max-w-full bg-gray-400 rounded cursor-pointer hover:h-1.5">
      <div className="h-full bg-indigo-500" style={{ width: `${percent}%` }} />
    </div>
  )
}

export default Progress
