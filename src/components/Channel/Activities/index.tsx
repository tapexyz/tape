import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import { FC } from 'react'
import {
  AiOutlineComment,
  AiOutlineInfoCircle,
  AiOutlineVideoCamera
} from 'react-icons/ai'
import { BiMoviePlay } from 'react-icons/bi'
import { GiMirrorMirror, GiMonkey } from 'react-icons/gi'
import { MdOutlineAnalytics, MdOutlineSlowMotionVideo } from 'react-icons/md'
import { Profile } from 'src/types/lens'

import About from './About'
import ChannelBytes from './ChannelBytes'
import ChannelStats from './ChannelStats'
import ChannelVideos from './ChannelVideos'
import CollectedNFTs from './CollectedNFTs'
import CommentedVideos from './CommentedVideos'
import MirroredVideos from './MirroredVideos'
import OtherChannels from './OtherChannels'

type Props = {
  channel: Profile
}

const Activities: FC<Props> = ({ channel }) => {
  return (
    <div className="my-4 md:ml-6 md:my-6">
      <div className="w-full">
        <Tab.Group>
          <Tab.List className="flex overflow-x-auto no-scrollbar">
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
              <AiOutlineVideoCamera />
              <span>Videos</span>
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
              <MdOutlineSlowMotionVideo />
              <span>Bytes</span>
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
              <AiOutlineComment />
              <span>Commented</span>
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
              <GiMirrorMirror />
              <span>Mirrored</span>
            </Tab>
            <Tab
              className={({ selected }) =>
                clsx(
                  'px-4 py-2 flex items-center space-x-2 border-b-2 whitespace-nowrap text-sm focus:outline-none',
                  selected
                    ? 'border-indigo-900 opacity-100'
                    : 'border-transparent opacity-50'
                )
              }
            >
              <GiMonkey />
              <span>NFTs</span>
            </Tab>
            <Tab
              className={({ selected }) =>
                clsx(
                  'px-4 py-2 border-b-2 flex items-center space-x-2 text-sm focus:outline-none',
                  selected
                    ? 'border-indigo-900 opacity-100'
                    : 'border-transparent opacity-50'
                )
              }
            >
              <BiMoviePlay />
              <span>Channels</span>
            </Tab>
            <Tab
              className={({ selected }) =>
                clsx(
                  'px-4 py-2 border-b-2 flex items-center space-x-2 text-sm focus:outline-none',
                  selected
                    ? 'border-indigo-900 opacity-100'
                    : 'border-transparent opacity-50'
                )
              }
            >
              <MdOutlineAnalytics />
              <span>Stats</span>
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
              <AiOutlineInfoCircle />
              <span>About</span>
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
              <ChannelStats channel={channel} />
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

export default Activities
