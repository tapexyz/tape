import { Trans } from '@lingui/macro'
import { Button, Flex } from '@radix-ui/themes'
import { STATIC_ASSETS } from '@tape.xyz/constants'
import Link from 'next/link'
import React from 'react'

const WelcomeAlert = () => {
  return (
    <div className="tape-border rounded-large ultrawide:h-[400px] relative flex h-[350px] w-[500px] flex-none overflow-hidden">
      <div className="absolute inset-0 h-full w-full bg-[#29ABE2]" />
      <div className="from-brand-700 absolute inset-0 h-full w-full bg-gradient-to-b to-transparent" />
      <img
        src={`${STATIC_ASSETS}/brand/transparent-bg-large.svg`}
        className="absolute -left-2"
        alt=""
      />
      <div className="ultrawide:p-8 relative flex h-full flex-col justify-end space-y-4 p-4 text-left text-white md:p-6">
        <div className="text-3xl">
          Welcome to <b>Tape</b>
        </div>
        <p className="md:text-md max-w-2xl text-sm lg:text-lg">
          <Trans>
            Discover a new era of content sharing on Lens with Tape. A
            decentralized, user-centric approach to online media.
          </Trans>
        </p>
        <Flex gap="3">
          <Link href="/login">
            <Button size="3" highContrast>
              Login
            </Button>
          </Link>
          <Button size="3" highContrast variant="surface">
            Learn More
          </Button>
        </Flex>
      </div>
    </div>
  )
}

export default WelcomeAlert
