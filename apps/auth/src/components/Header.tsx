import { DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react'
import { STATIC_ASSETS } from '@lenstube/constants'
import React, { useEffect } from 'react'

const Header = () => {
  const { sdkHasLoaded, isFullyConnected } = useDynamicContext()

  useEffect(() => {
    if (sdkHasLoaded && !isFullyConnected) {
      const shadowRoot =
        document.getElementsByClassName('dynamic-shadow-dom')[0].shadowRoot
      console.log(
        '🚀 ~ file: Header.tsx:11 ~ useEffect ~ shadowRoot:',
        shadowRoot
      )
    }
  }, [sdkHasLoaded, isFullyConnected])

  if (!sdkHasLoaded) {
    return
  }

  return (
    <div className="absolute flex h-32 w-full items-center justify-between p-5 md:p-7">
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
