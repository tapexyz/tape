import { Button } from '@components/UIElements/Button'
import { STATIC_ASSETS, TAPE_APP_NAME } from '@tape.xyz/constants'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404</title>
      </Head>
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4 text-center">
        <div className="mb-10">
          <img
            src={`${STATIC_ASSETS}/images/illustrations/404.gif`}
            draggable={false}
            height={200}
            width={200}
            alt={TAPE_APP_NAME}
          />
        </div>
        <h1 className="text-4xl font-bold">404</h1>
        <div className="mb-6">This page could not be found.</div>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    </>
  )
}
