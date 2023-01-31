import MetaTags from '@components/Common/MetaTags'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { Analytics, LENSTUBE_APP_NAME, STATIC_ASSETS, TRACK } from 'utils'

const Thanks = () => {
  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.THANKS })
  }, [])

  return (
    <div className="space-y-5 md:py-10">
      <MetaTags title="Thanks" />
      <div className="bg-brand-400 flex h-48 w-full items-center justify-center">
        <div className="relative text-center">
          <div className="flex items-center space-x-2 text-3xl font-bold md:text-4xl">
            Thanks supporting our community!
          </div>
        </div>
      </div>
      <div className="mx-auto flex justify-center space-x-10">
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
      </div>
    </div>
  )
}

export default Thanks
