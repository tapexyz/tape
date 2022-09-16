import React, { useMemo } from 'react'

const NotificationsShimmer = () => {
  const notifications = useMemo(() => Array(14).fill(1), [])

  return (
    <div className="space-y-2 animate-pulse">
      {notifications.map((i, idx) => (
        <div key={`${i}_${idx}`} className="flex space-x-1">
          <div className="w-4 h-4 bg-gray-300 rounded dark:bg-gray-700" />
          <div className="flex-1 pb-1 space-y-2">
            <span className="space-y-2">
              <div className="w-1/2 h-2.5 bg-gray-300 rounded dark:bg-gray-700" />
              <div className="grid grid-cols-3 gap-x-2">
                <div className="h-2.5 col-span-2 bg-gray-300 rounded dark:bg-gray-700" />
                <div className="h-2.5 bg-gray-300 rounded dark:bg-gray-700" />
              </div>
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default NotificationsShimmer
