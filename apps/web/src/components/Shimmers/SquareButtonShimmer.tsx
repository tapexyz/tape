import React from 'react'

const SquareButtonShimmer = () => {
  return (
    <div className="flex self-center">
      <div className="animate-shimmer flex">
        <div className="rounded-lg bg-gray-200 p-3.5 md:rounded-xl md:p-[18px] dark:bg-gray-800" />
      </div>
    </div>
  )
}

export default SquareButtonShimmer
