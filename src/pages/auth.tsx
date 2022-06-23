import Login from '@components/Common/Login'
import MetaTags from '@components/Common/MetaTags'
import usePersistStore from '@lib/store/persist'
import { HOME } from '@utils/url-path'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function AuthRequiredPage() {
  const { isAuthenticated } = usePersistStore()
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
          <div className="mb-6">
            Connect Wallet & Sign with Ethereum to continue,
          </div>
          <div>
            <Login />
          </div>
        </div>
      </div>
    </>
  )
}
