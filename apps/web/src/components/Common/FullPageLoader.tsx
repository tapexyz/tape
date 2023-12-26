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
          alt="tape"
          className="h-10"
          draggable={false}
          height={50}
          src={`${STATIC_ASSETS}/brand/logo-with-text-light.webp`}
          width={180}
        />
      ) : (
        <img
          alt="tape"
          className="h-10"
          draggable={false}
          height={50}
          src={`${STATIC_ASSETS}/brand/logo-with-text-dark.webp`}
          width={180}
        />
      )}
    </div>
  )
}

export default FullPageLoader
