import Popover from '@components/UIElements/Popover'
import {
  APP_NAME,
  LENSTUBE_GITHUB_HANDLE,
  LENSTUBE_STATUS_PAGE,
  LENSTUBE_TWITTER_HANDLE
} from '@utils/constants'
import { Mixpanel, TRACK } from '@utils/track'
import { DISCORD, PRIVACY } from '@utils/url-path'
import Link from 'next/link'
import React from 'react'
import { BsThreeDots } from 'react-icons/bs'

const MoreTrigger = () => {
  return (
    <Popover
      trigger={
        <div className="flex flex-col space-y-2 mb-0.5">
          <button
            onClick={() => Mixpanel.track(TRACK.SYSTEM.MORE_MENU.OPEN)}
            type="button"
            className="flex p-3 py-4 justify-center rounded-lg hover:bg-gray-50 dark:hover:bg-[#181818] focus:outline-none opacity-90 hover:opacity-100"
          >
            <BsThreeDots />
          </button>
        </div>
      }
      position="bottom"
      positionClassName="left-[72px] -bottom-1"
      className="w-full"
    >
      <div className="p-2 max-h-96 mt-1.5 w-48 overflow-x-hidden overflow-y-auto border shadow-xl border-gray-100 rounded-xl dark:border-gray-800 bg-secondary">
        <div className="flex flex-col text-sm transition duration-150 ease-in-out">
          <div className="text-[11px] cursor-default p-1 font-semibold uppercase opacity-50">
            More
          </div>
          <div className="rounded-lg opacity-80 hover:opacity-100 hover:bg-gray-50 dark:hover:bg-gray-900">
            <Link
              href={LENSTUBE_STATUS_PAGE}
              onClick={() => Mixpanel.track(TRACK.SYSTEM.MORE_MENU.STATUS)}
              className="block px-2.5 py-1.5"
              target="_blank"
            >
              Status
            </Link>
          </div>
          <div className="rounded-lg opacity-80 hover:opacity-100 hover:bg-gray-50 dark:hover:bg-gray-900">
            <Link
              href={`https://github.com/${LENSTUBE_GITHUB_HANDLE}`}
              onClick={() => Mixpanel.track(TRACK.SYSTEM.MORE_MENU.GITHUB)}
              className="block px-2.5 py-1.5"
              target="_blank"
            >
              Github
            </Link>
          </div>
          <div className="rounded-lg opacity-80 hover:opacity-100 hover:bg-gray-50 dark:hover:bg-gray-900">
            <Link
              href={`https://twitter.com/${LENSTUBE_TWITTER_HANDLE}`}
              onClick={() => Mixpanel.track(TRACK.SYSTEM.MORE_MENU.TWITTER)}
              className="block px-2.5 py-1.5"
              target="_blank"
            >
              Twitter
            </Link>
          </div>
          <div className="rounded-lg opacity-80 hover:opacity-100 hover:bg-gray-50 dark:hover:bg-gray-900">
            <Link
              href={DISCORD}
              onClick={() => Mixpanel.track(TRACK.SYSTEM.MORE_MENU.DISCORD)}
              className="block px-2.5 py-1.5"
              target="_blank"
            >
              Discord
            </Link>
          </div>
          <div className="rounded-lg opacity-80 hover:opacity-100 hover:bg-gray-50 dark:hover:bg-gray-900">
            <Link
              href={`https://roadmap.lenstube.xyz`}
              onClick={() => Mixpanel.track(TRACK.SYSTEM.MORE_MENU.ROADMAP)}
              className="block px-2.5 py-1.5"
              target="_blank"
            >
              Give Feedback
            </Link>
          </div>
          <div className="text-[11px] cursor-default p-1 font-semibold uppercase opacity-50">
            Legal
          </div>
          <div className="rounded-lg hover:bg-gray-50 opacity-80 hover:opacity-100 dark:hover:bg-gray-900">
            <Link href={PRIVACY} className="block px-2.5 py-1.5">
              Privacy
            </Link>
          </div>
          <hr className="my-1 border-gray-200 dark:border-gray-800" />
          <div className="text-[11px] cursor-default p-1 font-semibold uppercase opacity-50">
            Powered by
          </div>
          <div className="rounded-lg hover:bg-gray-50 opacity-80 hover:opacity-100 dark:hover:bg-gray-900">
            <Link
              href={`https://livepeer.com/?utm_source=${APP_NAME}&utm_campaign=oss`}
              rel="noreferrer noopener"
              className="space-x-2 p-1.5 flex items-center"
              target="_blank"
            >
              <span>
                <img
                  src={`lenstube.svg`}
                  alt="lvpr"
                  className="w-3.5 h-3.5"
                  draggable={false}
                />
              </span>
              <span>Livepeer</span>
            </Link>
          </div>
          <div className="rounded-lg hover:bg-gray-50 opacity-80 hover:opacity-100 dark:hover:bg-gray-900">
            <Link
              href={`https://vercel.com/?utm_source=${APP_NAME}&utm_campaign=oss`}
              rel="noreferrer noopener"
              className="block space-x-2 p-1.5"
              target="_blank"
            >
              <span>▲</span>
              <span>Vercel</span>
            </Link>
          </div>
        </div>
      </div>
    </Popover>
  )
}

export default MoreTrigger
