import { STATIC_ASSETS } from '@tape.xyz/constants'
import { useTheme } from 'next-themes'
import React from 'react'

import MetaTags from './MetaTags'

const FullPageLoader = () => {
  const { resolvedTheme } = useTheme()

  return (
    <div className="grid h-screen place-items-center">
      <MetaTags />
      {resolvedTheme === 'dark' ? (
        <img
          src={`${STATIC_ASSETS}/brand/logo-with-text-light.webp`}
          className="h-10"
          alt="tape"
          height={50}
          width={180}
          draggable={false}
        />
      ) : (
        <img
          src={`${STATIC_ASSETS}/brand/logo-with-text-dark.webp`}
          className="h-10"
          height={50}
          width={180}
          alt="tape"
          draggable={false}
        />
      )}
    </div>
  )
}

export default FullPageLoader
