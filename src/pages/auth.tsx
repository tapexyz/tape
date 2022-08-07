import { ClaimHandle } from '@components/Common/CreateChannel'
import Login from '@components/Common/Login'
import MetaTags from '@components/Common/MetaTags'
import { Button } from '@components/UIElements/Button'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { IS_MAINNET } from '@utils/constants'
import { HOME } from '@utils/url-path'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function AuthRequiredPage() {
  const setShowCreateChannel = useAppStore(
    (state) => state.setShowCreateChannel
  )
  const isSignedUser = usePersistStore((state) => state.isSignedUser)
  const isAuthenticated = usePersistStore((state) => state.isAuthenticated)
  const router = useRouter()
  useEffect(() => {
    if (isAuthenticated) {
      router.push(router.query?.next ? (router.query?.next as string) : HOME)
    }
  }, [isAuthenticated, router])

  return (
    <>
      <MetaTags title="Login" />
      <div className="flex flex-col items-center justify-start h-full mt-10 md:mt-20">
        <img
          src="/lenstube.svg"
          alt="LensTube"
          draggable={false}
          height={50}
          width={50}
        />
        <div className="flex flex-col items-center justify-center py-10">
          <h1 className="mb-4 text-3xl font-bold">Sign In Required</h1>
          {isSignedUser && !isAuthenticated ? (
            <div className="text-center">
              {IS_MAINNET ? (
                <ClaimHandle />
              ) : (
                <div className="flex flex-col items-center">
                  <span className="mb-4 text-sm opacity-70">
                    Your address does not seem to have Lens handle.
                  </span>
                  <Button onClick={() => setShowCreateChannel(true)}>
                    <span className="truncate whitespace-nowrap">
                      Create Channel
                    </span>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                Connect Wallet & Sign with Lens to continue,
              </div>
              <div>
                <Login />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
