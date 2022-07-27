import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { FC } from 'react'
import { Profile } from 'src/types'

const About = dynamic(() => import('./About'))
const OtherChannels = dynamic(() => import('./OtherChannels'))
const CommentedVideos = dynamic(() => import('./CommentedVideos'))
const ChannelVideos = dynamic(() => import('./ChannelVideos'))
const MirroredVideos = dynamic(() => import('./MirroredVideos'))
const CollectedNFTs = dynamic(() => import('./CollectedNFTs'))
const ChannelBytes = dynamic(() => import('./ChannelBytes'))

type Props = {
  channel: Profile
}

const Activity: FC<Props> = ({ channel }) => {
  return (
    <div className="my-4 md:ml-6 md:my-6">
      <div className="w-full">
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
              Bytes
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
              Mirrored
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
              Collected NFTs
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
              About
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel className="py-3 focus:outline-none">
              <ChannelVideos channel={channel} />
            </Tab.Panel>
            <Tab.Panel className="py-3 focus:outline-none">
              <ChannelBytes channel={channel} />
            </Tab.Panel>
            <Tab.Panel className="py-3 focus:outline-none">
              <CommentedVideos channel={channel} />
            </Tab.Panel>
            <Tab.Panel className="py-3 focus:outline-none">
              <MirroredVideos channel={channel} />
            </Tab.Panel>
            <Tab.Panel className="py-3 focus:outline-none">
              <CollectedNFTs channel={channel} />
            </Tab.Panel>
            <Tab.Panel className="py-3 focus:outline-none">
              <OtherChannels channel={channel} />
            </Tab.Panel>
            <Tab.Panel className="py-3 focus:outline-none">
              <About channel={channel} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  )
}

export default Activity
