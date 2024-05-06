import { Countdown } from '@components/UIElements/CountDown'
import SignalWaveGraphic from '@components/UIElements/SignalWaveGraphic'
import {
  GITCOIN_LIVE_ROUND,
  SHOW_GITCOIN_BANNER,
  TAPE_APP_NAME
} from '@tape.xyz/constants'
import { Button } from '@tape.xyz/ui'
import Link from 'next/link'
import React from 'react'

const GitcoinAlert = () => {
  if (!SHOW_GITCOIN_BANNER) {
    return null
  }

  return (
    <div className="tape-border rounded-large ultrawide:h-[400px] relative flex h-[350px] w-[500px] flex-none overflow-hidden">
      <div className="dark:to-bunker absolute inset-0 h-full w-full bg-gradient-to-b from-gray-100 dark:from-gray-900" />

      <div className="ultrawide:p-8 relative flex h-full flex-col justify-between p-4 text-left md:p-6">
        <span className="font-bold">
          <Countdown
            timestamp="2024-05-07T23:59:00+00:00"
            endText="GG20 round ended"
          />
        </span>

        <span className="space-y-4">
          <div className="text-3xl">GG{GITCOIN_LIVE_ROUND} is Live</div>
          <p className="md:text-md max-w-2xl text-sm lg:text-lg">
            Support {TAPE_APP_NAME} on{' '}
            <span className="font-medium">Gitcoin Grants</span> Round{' '}
            {GITCOIN_LIVE_ROUND}
          </p>

          <div className="flex">
            <Link href="/gitcoin" target="_blank">
              <Button>Contribute</Button>
            </Link>
          </div>
        </span>
      </div>

      <SignalWaveGraphic />
    </div>
  )
}

export default GitcoinAlert
