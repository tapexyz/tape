import DropMenu, { NextLink } from '@components/UIElements/DropMenu'
import { Menu } from '@headlessui/react'
import {
  APP_NAME,
  LENSTUBE_GITHUB_HANDLE,
  LENSTUBE_STATUS_PAGE,
  LENSTUBE_TWITTER_HANDLE,
  STATIC_ASSETS
} from '@utils/constants'
import { Mixpanel, TRACK } from '@utils/track'
import { DISCORD, PRIVACY } from '@utils/url-path'
import React from 'react'
import { BsThreeDots } from 'react-icons/bs'

const MoreTrigger = () => {
  return (
    <DropMenu
      trigger={
        <div className="flex flex-1 flex-col space-y-2 mb-0.5">
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
          <Menu.Item
            as={NextLink}
            className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100 hover:bg-gray-50 dark:hover:bg-gray-900"
            href={LENSTUBE_STATUS_PAGE}
            onClick={() => Mixpanel.track(TRACK.SYSTEM.MORE_MENU.STATUS)}
            target="_blank"
          >
            Status
          </Menu.Item>
          <Menu.Item
            as={NextLink}
            className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100 hover:bg-gray-50 dark:hover:bg-gray-900"
            href={`https://github.com/${LENSTUBE_GITHUB_HANDLE}`}
            onClick={() => Mixpanel.track(TRACK.SYSTEM.MORE_MENU.GITHUB)}
            target="_blank"
          >
            Github
          </Menu.Item>
          <Menu.Item
            as={NextLink}
            className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100 hover:bg-gray-50 dark:hover:bg-gray-900"
            href={`https://twitter.com/${LENSTUBE_TWITTER_HANDLE}`}
            onClick={() => Mixpanel.track(TRACK.SYSTEM.MORE_MENU.TWITTER)}
            target="_blank"
          >
            Twitter
          </Menu.Item>
          <Menu.Item
            as={NextLink}
            className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100 hover:bg-gray-50 dark:hover:bg-gray-900"
            href={DISCORD}
            onClick={() => Mixpanel.track(TRACK.SYSTEM.MORE_MENU.DISCORD)}
            target="_blank"
          >
            Discord
          </Menu.Item>
          <Menu.Item
            as={NextLink}
            className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100 hover:bg-gray-50 dark:hover:bg-gray-900"
            href={`https://roadmap.lenstube.xyz`}
            onClick={() => Mixpanel.track(TRACK.SYSTEM.MORE_MENU.ROADMAP)}
            target="_blank"
          >
            Give Feedback
          </Menu.Item>
          <div className="text-[11px] cursor-default p-1 font-semibold uppercase opacity-50">
            Legal
          </div>
          <Menu.Item
            as={NextLink}
            className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100 hover:bg-gray-50 dark:hover:bg-gray-900"
            href={PRIVACY}
          >
            Privacy
          </Menu.Item>
          <div className="text-[11px] cursor-default p-1 font-semibold uppercase opacity-50">
            Powered by
          </div>
          <Menu.Item
            as={NextLink}
            className="rounded-lg opacity-80 space-x-2 p-1.5 flex items-center hover:opacity-100 hover:bg-gray-50 dark:hover:bg-gray-900"
            href={`https://livepeer.studio/?utm_source=${APP_NAME}`}
            rel="noreferrer noopener"
            target="_blank"
          >
            <span>
              <img
                src={`${STATIC_ASSETS}/images/brand/lenstube.svg`}
                alt="lvpr"
                className="w-3 h-3"
                draggable={false}
              />
            </span>
            <span>Livepeer</span>
          </Menu.Item>
          <Menu.Item
            as={NextLink}
            className="rounded-lg opacity-80 space-x-2 p-1.5 hover:opacity-100 hover:bg-gray-50 dark:hover:bg-gray-900"
            href={`https://vercel.com/?utm_source=${APP_NAME}&utm_campaign=oss`}
            rel="noreferrer noopener"
            target="_blank"
          >
            <span>▲</span>
            <span>Vercel</span>
          </Menu.Item>
        </div>
      </div>
    </DropMenu>
  )
}

export default MoreTrigger
