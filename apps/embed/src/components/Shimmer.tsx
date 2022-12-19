import React from 'react'

const Shimmer = () => {
  return (
    <div className="w-full rounded-xl">
      <div className="flex flex-col space-x-2 animate-pulse">
        <div className="bg-gray-300 rounded-xl aspect-w-16 aspect-h-9" />
      </div>
    </div>
  )
}

export default Shimmer
