import React from 'react'

const ButtonShimmer = () => {
  return (
    <div className="animate-pulse">
      <div className="w-32 rounded-xl">
        <div className="rounded-xl bg-gray-300 px-4 py-4 dark:bg-gray-700" />
      </div>
    </div>
  )
}

export default ButtonShimmer
