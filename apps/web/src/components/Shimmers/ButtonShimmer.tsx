import { tw } from '@tape.xyz/browser'
import React from 'react'

const ButtonShimmer = ({ className = 'h-10' }) => {
  return (
    <div className="w-full animate-pulse">
      <div
        className={tw(
          'w-full rounded-lg bg-gray-200 dark:bg-gray-800',
          className
        )}
      />
    </div>
  )
}

export default ButtonShimmer
