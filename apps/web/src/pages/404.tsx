import MetaTags from '@components/Common/MetaTags'
import { Button } from '@radix-ui/themes'
import { STATIC_ASSETS, TAPE_APP_NAME } from '@tape.xyz/constants'
import Link from 'next/link'
import React from 'react'

const Custom404 = () => {
  return (
    <>
      <MetaTags title="Not found" />
      <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center space-y-4 text-center">
        <div className="mb-10">
          <img
            alt={TAPE_APP_NAME}
            draggable={false}
            height={200}
            src={`${STATIC_ASSETS}/images/illustrations/404.gif`}
            width={200}
          />
        </div>
        <h1 className="text-4xl font-bold">404</h1>
        <div className="mb-6">This page could not be found.</div>
        <Link href="/">
          <Button highContrast variant="surface">
            Go Home
          </Button>
        </Link>
      </div>
    </>
  )
}

export default Custom404
