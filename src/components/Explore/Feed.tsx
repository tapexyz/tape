import { Tab } from '@headlessui/react'
import { Mixpanel, TRACK } from '@utils/track'
import clsx from 'clsx'
import React from 'react'

import LooksRare from './LooksRare'
import Recents from './Recents'
import Trending from './Trending'

const ExploreFeed = () => {
  const onClickLooksRare = () => {
    Mixpanel.track(TRACK.PAGE_VIEW.EXPLORE_RARE)
  }
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
            <Tab.Panel
              onClick={() => onClickLooksRare()}
              className="py-3 focus:outline-none"
            >
              <LooksRare />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  )
}

export default ExploreFeed
