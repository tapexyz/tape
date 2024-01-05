import clsx from 'clsx'
import React from 'react'

const ButtonShimmer = ({ className = 'h-10' }) => {
  return (
    <div className="w-full animate-pulse">
      <div
        className={clsx(
          'w-full rounded-lg bg-gray-200 dark:bg-gray-800',
          className
        )}
      />
    </div>
  )
}

export default ButtonShimmer
