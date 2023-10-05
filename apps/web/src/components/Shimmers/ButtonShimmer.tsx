import { Box } from '@radix-ui/themes'
import React from 'react'

const ButtonShimmer = () => {
  return (
    <Box className="animate-pulse">
      <Box className="h-10 rounded-md bg-gray-200 dark:bg-gray-800" />
    </Box>
  )
}

export default ButtonShimmer
