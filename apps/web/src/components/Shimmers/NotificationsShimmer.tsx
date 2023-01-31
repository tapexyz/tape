import React, { useMemo } from 'react'

const NotificationsShimmer = () => {
  const notifications = useMemo(() => Array(20).fill(1), [])

  return (
    <div className="animate-pulse space-y-3">
      {notifications.map((i, idx) => (
        <div key={`${i}_${idx}`} className="w-full space-y-1.5">
          <div className="flex items-center space-x-3">
            <div className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-700" />
            <div className="h-3 w-1/3 rounded bg-gray-300 dark:bg-gray-700" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-2.5 w-1/2 rounded bg-gray-300 dark:bg-gray-700" />
            <div className="h-2.5 w-1/4 rounded bg-gray-300 dark:bg-gray-700" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default NotificationsShimmer
