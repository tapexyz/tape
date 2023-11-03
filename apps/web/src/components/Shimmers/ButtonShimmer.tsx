import { Box } from '@radix-ui/themes'
import React from 'react'

const ButtonShimmer = () => {
  return (
    <Box className="animate-pulse">
      <Box className="rounded-small h-10 w-32 bg-gray-200 dark:bg-gray-800" />
    </Box>
  )
}

export default ButtonShimmer
