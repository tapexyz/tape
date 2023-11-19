import { STATIC_ASSETS, TAPE_APP_NAME } from '@dragverse/constants'
import { Button, Flex } from '@radix-ui/themes'
import Link from 'next/link'

const WelcomeAlert = () => {
  return (
    <div className="tape-border rounded-large ultrawide:h-[400px] relative flex h-[350px] w-[500px] flex-none overflow-hidden">
      <div className="bg-brand-400 absolute inset-0 h-full w-full" />
      <div className="from-brand-600 absolute inset-0 h-full w-full bg-gradient-to-b to-transparent" />
      <img
        src={`${STATIC_ASSETS}/brand/transparent-bg-large.svg`}
        className="ultrawide:px-8 ultrawide:-top-10 absolute -top-20 px-4 md:px-6"
        alt="cover"
      />
      <div className="ultrawide:p-8 relative flex h-full flex-col justify-end space-y-4 p-4 text-left text-white md:p-6">
        <div className="text-3xl font-bold">Welcome to {TAPE_APP_NAME}</div>
        <p className="md:text-md max-w-2xl text-sm lg:text-lg">
          Empowering drag creators on Lens with {TAPE_APP_NAME}!
        </p>
        <Flex gap="3">
          <Link href="/login">
            <Button highContrast>Login</Button>
          </Link>
        </Flex>
      </div>
    </div>
  )
}

export default WelcomeAlert
