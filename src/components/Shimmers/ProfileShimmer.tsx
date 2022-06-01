import React from 'react'

const ProfileShimmer = () => {
  return (
    <div className="w-full max-w-sm rounded-md">
      <div className="flex flex-col space-x-2 animate-pulse">
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-gray-300 rounded-md dark:bg-gray-700"></div>
          <div className="flex-1 py-1 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="h-2 col-span-6 bg-gray-300 rounded dark:bg-gray-700"></div>
              <div className="h-2 col-span-4 bg-gray-300 rounded dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileShimmer
