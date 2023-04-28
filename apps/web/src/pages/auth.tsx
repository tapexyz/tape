import Login from '@components/Common/Auth/Login'
import MetaTags from '@components/Common/MetaTags'
import useAuthPersistStore from '@lib/store/auth'
import { t, Trans } from '@lingui/macro'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { LENSTUBE_APP_NAME, STATIC_ASSETS } from 'utils'

const AuthRequiredPage = () => {
  const selectedChannelId = useAuthPersistStore(
    (state) => state.selectedChannelId
  )
  const { replace, query } = useRouter()

  useEffect(() => {
    if (selectedChannelId && query?.next) {
      replace(query?.next as string)
    }
  }, [selectedChannelId, query, replace])

  return (
    <>
      <MetaTags title={t`Login`} />
      <div className="mt-10 flex h-full flex-col items-center justify-start md:mt-20">
        <img
          src={`${STATIC_ASSETS}/images/brand/lenstube.svg`}
          alt={LENSTUBE_APP_NAME}
          draggable={false}
          height={50}
          width={50}
        />
        <div className="flex flex-col items-center justify-center py-10">
          <h1 className="mb-4 text-3xl font-bold">
            <Trans>Sign In Required</Trans>
          </h1>
          <div className="mb-6 text-center">
            <Trans>Connect Wallet & Sign with Lens to continue,</Trans>
          </div>
          <div>
            <Login />
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthRequiredPage
