import { STATIC_ASSETS } from '@tape.xyz/constants'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import React from 'react'

const Logo = () => {
  const { resolvedTheme } = useTheme()

  return (
    <Link href="/" className="inline-flex">
      {resolvedTheme === 'dark' ? (
        <img
          src={`${STATIC_ASSETS}/brand/logo-with-text-light.webp`}
          className="-mb-0.5 h-6"
          alt="tape"
          height={30}
          width={110}
          draggable={false}
        />
      ) : (
        <img
          src={`${STATIC_ASSETS}/brand/logo-with-text-dark.webp`}
          className="-mb-0.5 h-6"
          height={30}
          width={110}
          alt="tape"
          draggable={false}
        />
      )}
    </Link>
  )
}

export default Logo
