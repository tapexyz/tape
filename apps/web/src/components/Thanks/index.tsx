import MetaTags from '@components/Common/MetaTags'
import { Analytics, TRACK } from '@lenstube/browser'
import { LENSTUBE_APP_NAME, STATIC_ASSETS } from '@lenstube/constants'
import { t, Trans } from '@lingui/macro'
import Link from 'next/link'
import React, { useEffect } from 'react'

const Thanks = () => {
  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.THANKS })
  }, [])

  return (
    <div className="space-y-5 md:py-10">
      <MetaTags title={t`Thanks`} />
      <div className="bg-brand-400 flex h-48 w-full items-center justify-center">
        <div className="relative text-center">
          <div className="flex items-center space-x-2 text-3xl font-bold md:text-4xl">
            <Trans>Thanks for supporting our community!</Trans>
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-xl grid-cols-2 place-items-start gap-12">
        <Link
          href={`https://livepeer.studio/?utm_source=${LENSTUBE_APP_NAME}`}
          className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1"
        >
          <img
            src={`${STATIC_ASSETS}/images/livepeer.png`}
            alt="lvpr"
            className="h-20 w-20 flex-none rounded-full"
            draggable={false}
          />
          <div className="px-5">Livepeer</div>
        </Link>
        <Link
          href={`https://4everland.org/?utm_source=${LENSTUBE_APP_NAME}`}
          className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1"
        >
          <img
            src={`${STATIC_ASSETS}/images/4everland.png`}
            alt="lvpr"
            className="h-20 w-20 flex-none rounded-full"
            draggable={false}
          />
          <div className="px-5">4everland</div>
        </Link>
        <Link
          href={`https://betteruptime.com/?utm_source=${LENSTUBE_APP_NAME}`}
          className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1"
        >
          <img
            src={`${STATIC_ASSETS}/images/betteruptime.png`}
            alt="betteruptime"
            className="h-20 w-20 flex-none rounded-full"
            draggable={false}
          />
          <div className="px-5">Better Uptime</div>
        </Link>
      </div>
    </div>
  )
}

export default Thanks
