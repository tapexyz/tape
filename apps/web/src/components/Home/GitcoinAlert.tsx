import HandWaveOutline from '@components/Common/Icons/HandWaveOutline'
import { Button } from '@components/UIElements/Button'
import { Trans } from '@lingui/macro'
import Link from 'next/link'
import React from 'react'
import { LENSTUBE_APP_NAME, WINDOW_BACKGROUND_URL } from 'utils/constants'

const GitcoinAlert: React.FC = () => {
  return (
    <div className="mb-4 w-full">
      <div
        className="relative flex flex-col overflow-hidden rounded-xl bg-cover p-6 lg:p-8"
        style={{ backgroundImage: `url(${WINDOW_BACKGROUND_URL})` }}
      >
        <div className="absolute inset-0 h-full w-full dark:from-gray-800 dark:to-gray-900" />
        <div className="relative z-[1] flex flex-col items-start space-y-4 text-left">
          <div className="flex items-center rounded-full bg-gradient-to-br from-orange-200 to-orange-300 px-3 py-1 text-xs font-medium text-black">
            <HandWaveOutline className="h-3.5 w-3.5" />
            <span className="ml-1">
              <Trans>GG18 is Live</Trans>
            </span>
          </div>
          <div className="flex w-full flex-1 flex-wrap items-center justify-between gap-y-3 dark:text-gray-100">
            <p className="md:text-md text-sm lg:text-lg">
              Support {LENSTUBE_APP_NAME} on{' '}
              <span className="font-medium">Gitcoin Grants</span> Round 18
            </p>
            <Link
              href="https://explorer.gitcoin.co/#/round/10/0x2871742b184633f8dc8546c6301cbc209945033e/0x2871742b184633f8dc8546c6301cbc209945033e-308"
              target="_blank"
            >
              <Button>Contribute Now</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GitcoinAlert
