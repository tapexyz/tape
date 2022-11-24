import { Button } from '@components/UIElements/Button'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { STATIC_ASSETS } from 'utils'

export default function Custom500() {
  return (
    <>
      <Head>
        <title>500 - Server Error</title>
      </Head>
      <div className="flex flex-col items-center justify-start h-full mt-10 md:mt-20">
        <img
          src={`${STATIC_ASSETS}/images/brand/lenstube.svg`}
          alt="LensTube"
          draggable={false}
          height={50}
          width={50}
        />
        <div className="py-10 text-center">
          <h1 className="mb-4 text-3xl font-bold">
            Looks like something went wrong!
          </h1>
          <div className="max-w-lg mb-6">
            We track these errors automatically, but if the problem persists
            feel free to contact us. In the meantime, try refreshing.
          </div>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    </>
  )
}
