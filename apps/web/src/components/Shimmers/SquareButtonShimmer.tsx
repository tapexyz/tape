import React from 'react'

const SquareButtonShimmer = () => {
  return (
    <div className="flex self-center">
      <div className="flex animate-pulse">
        <div className="rounded-lg bg-gray-200 p-3.5 dark:bg-gray-800 md:rounded-xl md:p-[18px]" />
      </div>
    </div>
  )
}

export default SquareButtonShimmer
