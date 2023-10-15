import { Button } from '@components/UIElements/Button'
import { Flex } from '@radix-ui/themes'
import { STATIC_ASSETS, TAPE_APP_NAME } from '@tape.xyz/constants'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

export default function Custom500() {
  return (
    <>
      <Head>
        <title>500 - Server Error</title>
      </Head>
      <div className="flex h-screen flex-col items-center justify-center text-center">
        <Flex gap="2" mb="4" align="center" justify="center">
          <img
            src={`${STATIC_ASSETS}/brand/logo.svg`}
            draggable={false}
            height={50}
            width={50}
            alt={TAPE_APP_NAME}
          />
          <h1 className="text-3xl font-bold">
            Looks like something went wrong!
          </h1>
        </Flex>
        <div className="mb-6 max-w-lg">
          We track these errors automatically, but if the problem persists feel
          free to contact us. In the meantime, try refreshing.
        </div>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    </>
  )
}
