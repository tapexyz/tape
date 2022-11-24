import MetaTags from '@components/Common/MetaTags'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { Analytics, LENSTUBE_APP_NAME, STATIC_ASSETS, TRACK } from 'utils'

const Thanks = () => {
  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.STACK })
  }, [])

  return (
    <div className="space-y-5 md:py-10">
      <MetaTags title="Powering Lenstube!" />
      <div>
        <div className="text-[11px] mt-2 px-2.5 cursor-default p-1 font-semibold uppercase opacity-50">
          Powered by
        </div>
        <div className="px-1">
          <Link
            className="rounded-lg opacity-80 space-x-2 p-1.5 flex text-sm items-center hover:opacity-100"
            href={`https://livepeer.studio/?utm_source=${LENSTUBE_APP_NAME}`}
            rel="noreferrer noopener"
            target="_blank"
          >
            <img
              src={`${STATIC_ASSETS}/images/livepeer.png`}
              alt="lvpr"
              className="w-3 h-3 flex-none"
              draggable={false}
            />
            <span>Livepeer</span>
          </Link>
          <Link
            className="rounded-lg opacity-80 space-x-2 text-sm p-1.5 hover:opacity-100"
            href={`https://vercel.com/?utm_source=${LENSTUBE_APP_NAME}&utm_campaign=oss`}
            rel="noreferrer noopener"
            target="_blank"
          >
            <span>▲</span>
            <span>Vercel</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Thanks
