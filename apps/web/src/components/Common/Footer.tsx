import Link from 'next/link'
import React from 'react'
import {
  Analytics,
  LENSTUBE_APP_NAME,
  LENSTUBE_GITHUB_HANDLE,
  LENSTUBE_STATUS_PAGE,
  LENSTUBE_TWITTER_HANDLE,
  STATIC_ASSETS,
  TRACK
} from 'utils'

const Footer = () => {
  return (
    <>
      <div className="grid grid-cols-2 text-sm">
        <Link
          className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
          href={`https://roadmap.lenstube.xyz`}
          onClick={() => Analytics.track(TRACK.SYSTEM.MORE_MENU.ROADMAP)}
          target="_blank"
        >
          Feedback
        </Link>
        <Link
          className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
          href={LENSTUBE_STATUS_PAGE}
          onClick={() => Analytics.track(TRACK.SYSTEM.MORE_MENU.STATUS)}
          target="_blank"
        >
          Status
        </Link>
        <Link
          className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
          href={`https://github.com/${LENSTUBE_GITHUB_HANDLE}`}
          onClick={() => Analytics.track(TRACK.SYSTEM.MORE_MENU.GITHUB)}
          target="_blank"
        >
          Github
        </Link>
        <Link
          className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
          href={`https://twitter.com/${LENSTUBE_TWITTER_HANDLE}`}
          onClick={() => Analytics.track(TRACK.SYSTEM.MORE_MENU.TWITTER)}
          target="_blank"
        >
          Twitter
        </Link>
        <Link
          className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
          href="/discord"
          onClick={() => Analytics.track(TRACK.SYSTEM.MORE_MENU.DISCORD)}
          target="_blank"
        >
          Discord
        </Link>
        <Link
          className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
          href="/privacy"
        >
          Privacy
        </Link>
      </div>
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
    </>
  )
}

export default Footer
