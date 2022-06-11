import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import { FC } from 'react'
import { Profile } from 'src/types'

import About from './About'
import ChannelVideos from './ChannelVideos'
import CommentedVideos from './CommentedVideos'
import OtherChannels from './OtherChannels'

type Props = {
  channel: Profile
}

const Activity: FC<Props> = ({ channel }) => {
  return (
    <div className="my-4 md:ml-5 md:my-6">
      <div className="grid gap-4 md:grid-cols-12">
        <div className="col-span-3 md:mt-3">
          <About channel={channel} />
        </div>
        <div className="w-full col-span-9">
          <Tab.Group>
            <Tab.List className="flex">
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
                Videos
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
                Commented
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
                Channels
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel className="py-3 focus:outline-none">
                <ChannelVideos channel={channel} />
              </Tab.Panel>
              <Tab.Panel className="py-3 focus:outline-none">
                <CommentedVideos channel={channel} />
              </Tab.Panel>
              <Tab.Panel className="py-3 focus:outline-none">
                <OtherChannels channel={channel} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  )
}

export default Activity
