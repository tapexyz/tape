import MetaTags from '@components/Common/MetaTags'
import { Button } from '@radix-ui/themes'
import { STATIC_ASSETS, TAPE_APP_NAME } from '@tape.xyz/constants'
import Link from 'next/link'
import React from 'react'

const Custom500 = () => {
  return (
    <>
      <MetaTags title="500" />
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4 text-center">
        <div className="mb-10">
          <img
            alt={TAPE_APP_NAME}
            draggable={false}
            height={200}
            src={`${STATIC_ASSETS}/images/illustrations/404.gif`}
            width={200}
          />
        </div>
        <h1 className="text-3xl font-bold">Looks like something went wrong!</h1>
        <div className="mb-6 max-w-lg">
          We track these errors automatically, but if the problem persists feel
          free to contact us. In the meantime, try refreshing.
        </div>
        <Link href="/">
          <Button highContrast variant="surface">
            Go Home
          </Button>
        </Link>
      </div>
    </>
  )
}

export default Custom500
