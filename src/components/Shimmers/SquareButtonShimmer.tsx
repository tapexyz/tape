import React from 'react'

const SquareButtonShimmer = () => {
  return (
    <div className="flex self-center">
      <div className="flex animate-pulse">
        <div className="p-3.5 bg-gray-300 md:p-5 rounded-lg md:rounded-xl dark:bg-gray-700"></div>
      </div>
    </div>
  )
}

export default SquareButtonShimmer
