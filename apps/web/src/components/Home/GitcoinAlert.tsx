import {
  GITCOIN_LIVE_ROUND,
  SHOW_GITCOIN_BANNER,
  TAPE_APP_NAME
} from '@dragverse/constants'

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
          Thank you for your support during the GG{GITCOIN_LIVE_ROUND} Round⚡
        </div>
        <p className="md:text-md max-w-2xl text-sm lg:text-lg">
          WE SEE YOU, GROWER! 🌱⚡ These funds allow us to keep working on our
          next {TAPE_APP_NAME} Ball and creating resources for the community on how to use the dApp.
        </p>
      </div>
    </div>
  )
}

export default GitcoinAlert
