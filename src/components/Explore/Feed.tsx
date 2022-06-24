import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import React from 'react'

const Trending = dynamic(() => import('./Trending'))
const LooksRare = dynamic(() => import('./LooksRare'))
const Recents = dynamic(() => import('./Recents'))

const ExploreFeed = () => {
  return (
    <div>
      <div className="w-full col-span-9">
        <Tab.Group>
          <Tab.List className="flex overflow-x-auto no-scrollbar">
            <Tab
              className={({ selected }) =>
                clsx(
                  'px-4 py-2 border-b-2 text-sm focus:outline-none',
                  selected
                    ? 'border-indigo-900 opacity-100'
                    : 'border-transparent opacity-50'
                )
              }
            >
              Recents
            </Tab>
            <Tab
              className={({ selected }) =>
                clsx(
                  'px-4 py-2 border-b-2 text-sm focus:outline-none',
                  selected
                    ? 'border-indigo-900 opacity-100'
                    : 'border-transparent opacity-50'
                )
              }
            >
              Trending
            </Tab>
            <Tab
              className={({ selected }) =>
                clsx(
                  'px-4 py-2 border-b-2 text-sm focus:outline-none',
                  selected
                    ? 'border-indigo-900 opacity-100'
                    : 'border-transparent opacity-50'
                )
              }
            >
              Looks Rare
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel className="py-3 focus:outline-none">
              <Recents />
            </Tab.Panel>
            <Tab.Panel className="py-3 focus:outline-none">
              <Trending />
            </Tab.Panel>
            <Tab.Panel className="py-3 focus:outline-none">
              <LooksRare />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  )
}

export default ExploreFeed
