import {
  GITCOIN_LIVE_ROUND,
  SHOW_GITCOIN_BANNER,
  TAPE_APP_NAME
} from '@dragverse/constants'
import { Button, Flex } from '@radix-ui/themes'
import Link from 'next/link'

const GitcoinAlert = () => {
  if (!SHOW_GITCOIN_BANNER) {
    return null
  }

  return (
    <div className="tape-border rounded-large ultrawide:h-[400px] relative flex h-[350px] w-[500px] flex-none overflow-hidden">
      <div className="bg-brand-150 absolute inset-0 h-full w-full" />
      <div className="from-brand-250 absolute inset-0 h-full w-full bg-gradient-to-b to-transparent" />

      <div className="ultrawide:p-8 relative flex h-full flex-col justify-end space-y-4 p-4 text-left md:p-6">
        <div className="text-3xl">
          Bring more Drag to the network and the metaverse⚡
        </div>
        <p className="md:text-md max-w-2xl text-sm lg:text-lg">
          Support {TAPE_APP_NAME} on{' '}
          <span className="font-medium">Gitcoin Grants</span>{' '}
          {GITCOIN_LIVE_ROUND} Round and help us fund or next metaverse show and
          building roadmap.
        </p>
        <Flex>
          <Link href="/gitcoin" target="_blank">
            <Button highContrast>Contribute Community Round</Button>
          </Link>
          <Link href="https://explorer.gitcoin.co/#/round/10/0xc34745b3852df32d5958be88df2bee0a83474001/0xc34745b3852df32d5958be88df2bee0a83474001-15" target="_blank">
            <Button highContrast>Contribute Social Round</Button>
          </Link>
        </Flex>
      </div>
    </div>
  )
}

export default GitcoinAlert
