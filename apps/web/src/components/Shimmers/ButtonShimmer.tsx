import { Box } from '@radix-ui/themes'
import clsx from 'clsx'
import React from 'react'

const ButtonShimmer = ({ className = 'h-10' }) => {
  return (
    <Box className="animate-pulse">
      <Box
        className={clsx(
          'rounded-small w-32 bg-gray-200 dark:bg-gray-800',
          className
        )}
      />
    </Box>
  )
}

export default ButtonShimmer
