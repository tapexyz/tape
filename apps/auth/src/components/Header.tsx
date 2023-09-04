import { DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react'
import { STATIC_ASSETS } from '@lenstube/constants'
import React from 'react'

const Header = () => {
  const { sdkHasLoaded } = useDynamicContext()

  if (!sdkHasLoaded) {
    return
  }

  return (
    <div className="absolute flex h-28 w-full items-center justify-between p-5 md:px-7">
      <img
        src={`${STATIC_ASSETS}/images/brand/lenstube.svg`}
        className="h-12 w-12"
        alt="lenstube"
        width={12}
        height={12}
        draggable={false}
      />
      <DynamicWidget />
    </div>
  )
}

export default Header
