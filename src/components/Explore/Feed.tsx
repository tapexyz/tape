import { Tab } from '@headlessui/react'
import useAppStore from '@lib/store'
import { ADMIN_IDS } from '@utils/constants'
import clsx from 'clsx'
import React from 'react'
import { AiOutlineFire } from 'react-icons/ai'
import { BiTimeFive } from 'react-icons/bi'
import { HiOutlineCollection } from 'react-icons/hi'

import LooksRare from './LooksRare'
import Recents from './Recents'
import Trending from './Trending'

const ExploreFeed = () => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const isAdmin = ADMIN_IDS.includes(selectedChannel?.id)

  return (
    <Tab.Group as="div" className="w-full col-span-9">
      <Tab.List className="flex overflow-x-auto no-scrollbar">
        <Tab
          className={({ selected }) =>
            clsx(
              'px-4 py-2 flex whitespace-nowrap items-center space-x-2 border-b-2 text-sm focus:outline-none',
              selected
                ? 'border-indigo-900 opacity-100'
                : 'border-transparent opacity-50'
            )
          }
        >
          <HiOutlineCollection />
          <span>Looks Rare</span>
        </Tab>
        <Tab
          className={({ selected }) =>
            clsx(
              'px-4 py-2 flex items-center space-x-2 border-b-2 text-sm focus:outline-none',
              selected
                ? 'border-indigo-900 opacity-100'
                : 'border-transparent opacity-50'
            )
          }
        >
          <AiOutlineFire />
          <span>Trending</span>
        </Tab>
        {isAdmin && (
          <Tab
            className={({ selected }) =>
              clsx(
                'px-4 py-2 flex items-center space-x-2 border-b-2 text-sm focus:outline-none',
                selected
                  ? 'border-indigo-900 opacity-100'
                  : 'border-transparent opacity-50'
              )
            }
          >
            <BiTimeFive />
            <span>Recents</span>
          </Tab>
        )}
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel className="py-3 focus:outline-none">
          <LooksRare />
        </Tab.Panel>
        <Tab.Panel className="py-3 focus:outline-none">
          <Trending />
        </Tab.Panel>
        {isAdmin && (
          <Tab.Panel className="py-3 focus:outline-none">
            <Recents />
          </Tab.Panel>
        )}
      </Tab.Panels>
    </Tab.Group>
  )
}

export default ExploreFeed
