import usePlayerStore from '@lib/store/player'
import React from 'react'

const Progress = () => {
  const duration = usePlayerStore((state) => state.duration)
  const currentTime = usePlayerStore((state) => state.currentTime)
  const percent = currentTime ? ((currentTime / duration) * 100).toFixed(2) : 0

  return (
    <div className="h-1 max-w-full bg-gray-400 rounded cursor-pointer hover:h-1.5">
      <div className="h-full bg-indigo-500" style={{ width: `${percent}%` }} />
    </div>
  )
}

export default Progress
