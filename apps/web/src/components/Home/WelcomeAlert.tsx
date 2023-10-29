import { Trans } from '@lingui/macro'
import { STATIC_ASSETS } from '@tape.xyz/constants'
import React from 'react'

const WelcomeAlert = () => {
  return (
    <div className="mb-6 w-full">
      <div className="relative flex flex-col overflow-hidden rounded-2xl">
        <div className="absolute inset-0 h-full w-full bg-[#29ABE2]" />
        <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-[#316FC9] to-transparent" />
        <img
          src={`${STATIC_ASSETS}/brand/transparent-bg.svg`}
          alt=""
          className="absolute -left-2"
        />
        <div className="relative z-[1] flex flex-col items-start space-y-4 p-6 text-left text-white md:px-8 md:py-10">
          <div className="text-2xl">
            Welcome to <b>GoodGains Live</b>
          </div>
          <div className="flex w-full flex-1 flex-wrap items-center justify-between gap-y-3 dark:text-gray-100">
            <p className="md:text-md max-w-2xl text-sm lg:text-lg">
              <Trans>
                Discover a new era of content sharing on Lens with Live. A
                decentralized, user-centric approach to online media.
              </Trans>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeAlert
