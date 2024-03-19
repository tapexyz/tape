import { TAPE_APP_NAME } from '@dragverse/constants'
import { Button } from '@dragverse/ui'
import Link from 'next/link'

const WelcomeAlert = () => {
  return (
    <div className="tape-border rounded-large ultrawide:h-[400px] relative flex h-[350px] w-[500px] flex-none overflow-hidden  sm:w-[300px] md:w-[400px]">
      <div className="bg-brand-950 absolute inset-0 h-full w-full" />
      <div className="from-brand-900 absolute inset-0 h-full w-full bg-gradient-to-b to-transparent" />
      <div className="ultrawide:p-8 relative flex h-full flex-col justify-end space-y-4 p-4 text-left text-white md:p-6">
        <div className="text-3xl font-bold">Welcome to {TAPE_APP_NAME}</div>
        <p className="md:text-md max-w-2xl text-sm lg:text-lg">
          Purse first! 👛 Connect your wallet, confirm you have a Lens account,
          🗝 and interact with content from the most fabulous community on the
          intern3t!🌈✨.
        </p>
        <div className="flex gap-3">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default WelcomeAlert
