import React, { useMemo } from 'react'

const NotificationsShimmer = () => {
  const notifications = useMemo(() => Array(20).fill(1), [])

  return (
    <div className="space-y-3 animate-pulse">
      {notifications.map((i, idx) => (
        <div key={`${i}_${idx}`} className="w-full space-y-1.5">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gray-300 rounded-full dark:bg-gray-700" />
            <div className="w-1/3 h-3 bg-gray-300 rounded dark:bg-gray-700" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-2.5 w-1/2 bg-gray-300 rounded dark:bg-gray-700" />
            <div className="h-2.5 w-1/4 bg-gray-300 rounded dark:bg-gray-700" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default NotificationsShimmer
