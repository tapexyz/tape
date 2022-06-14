import React from 'react'

const SquareButtonShimmer = () => {
  return (
    <div className="flex self-center">
      <div className="flex animate-pulse">
        <div className="p-5 bg-gray-300 rounded-xl dark:bg-gray-700"></div>
      </div>
    </div>
  )
}

export default SquareButtonShimmer
