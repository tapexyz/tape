import React from 'react'

const SquareButtonShimmer = () => {
  return (
    <div className="flex self-center">
      <div className="flex animate-pulse">
        <div className="rounded-lg bg-gray-300 p-3.5 dark:bg-gray-700 md:rounded-xl md:p-[18px]" />
      </div>
    </div>
  )
}

export default SquareButtonShimmer
