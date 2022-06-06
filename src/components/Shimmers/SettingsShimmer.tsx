import React from 'react'

const SettingsShimmer = () => {
  return (
    <div className="w-full rounded-md">
      <div className="flex flex-col md:space-x-4 animate-pulse">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="col-span-4 md:col-span-1">
            <div className="h-[40vh] bg-gray-300 rounded-md dark:bg-gray-700"></div>
          </div>
          <div className="col-span-4 md:col-span-3">
            <div className="h-[90vh] bg-gray-300 rounded-md dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsShimmer
