import { Button } from '@components/UIElements/Button'
import { LENSTUBE_APP_NAME, STATIC_ASSETS } from '@lenstube/constants'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404</title>
      </Head>
      <div className="mt-10 flex h-full flex-col items-center justify-start md:mt-20">
        <img
          src={`${STATIC_ASSETS}/images/brand/lenstube.svg`}
          alt={LENSTUBE_APP_NAME}
          draggable={false}
          height={50}
          width={50}
        />
        <div className="py-10 text-center">
          <h1 className="mb-4 text-3xl font-bold">404</h1>
          <div className="mb-6">This page could not be found.</div>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    </>
  )
}
