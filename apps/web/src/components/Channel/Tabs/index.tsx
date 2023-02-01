import BytesOutline from '@components/Common/Icons/BytesOutline'
import ChannelOutline from '@components/Common/Icons/ChannelOutline'
import CollectOutline from '@components/Common/Icons/CollectOutline'
import CommentOutline from '@components/Common/Icons/CommentOutline'
import GraphOutline from '@components/Common/Icons/GraphOutline'
import InfoOutline from '@components/Common/Icons/InfoOutline'
import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import type { Profile } from 'lens'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React from 'react'
import { Analytics, TRACK } from 'utils'

import VideoOutline from '../../Common/Icons/VideoOutline'
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

const Tabs: FC<Props> = ({ channel }) => {
  const router = useRouter()

  const getDefaultTab = () => {
    switch (router.query.tab) {
      case 'bytes':
        return 1
      case 'commented':
        return 2
      case 'mirrored':
        return 3
      case 'nfts':
        return 4
      case 'channels':
        return 5
      case 'stats':
        return 6
      case 'about':
        return 7
      default:
        return 0
    }
  }

  const handleTabChange = (tab: string) => {
    router.replace({ query: { ...router.query, tab } }, undefined, {
      shallow: true
    })
  }

  return (
    <Tab.Group
      as="div"
      className="container mx-auto w-full max-w-[85rem] md:p-2"
      defaultIndex={getDefaultTab()}
    >
      <Tab.List className="no-scrollbar flex space-x-2 overflow-x-auto">
        <Tab
          onClick={() => {
            handleTabChange('all')
            Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_VIDEOS)
          }}
          className={({ selected }) =>
            clsx(
              'flex items-center space-x-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium uppercase transition duration-300 ease-in-out focus:outline-none',
              selected
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'hover:bg-gray-200 hover:dark:bg-gray-800'
            )
          }
        >
          <VideoOutline className="h-4 w-4" />
          <span>Videos</span>
        </Tab>
        <Tab
          onClick={() => {
            handleTabChange('bytes')
            Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_BYTES)
          }}
          className={({ selected }) =>
            clsx(
              'flex items-center space-x-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium uppercase transition duration-300 ease-in-out focus:outline-none',
              selected
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'hover:bg-gray-200 hover:dark:bg-gray-800'
            )
          }
        >
          <BytesOutline className="h-4 w-4" />
          <span>Bytes</span>
        </Tab>
        <Tab
          onClick={() => {
            handleTabChange('commented')
            Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_COMMENTED)
          }}
          className={({ selected }) =>
            clsx(
              'flex items-center space-x-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium uppercase transition duration-300 ease-in-out focus:outline-none',
              selected
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'hover:bg-gray-200 hover:dark:bg-gray-800'
            )
          }
        >
          <CommentOutline className="h-4 w-4" />
          <span>Commented</span>
        </Tab>
        <Tab
          onClick={() => {
            handleTabChange('mirrored')
            Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_MIRRORED)
          }}
          className={({ selected }) =>
            clsx(
              'flex items-center space-x-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium uppercase transition duration-300 ease-in-out focus:outline-none',
              selected
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'hover:bg-gray-200 hover:dark:bg-gray-800'
            )
          }
        >
          <MirrorOutline className="h-4 w-4" />
          <span>Mirrored</span>
        </Tab>
        <Tab
          onClick={() => {
            handleTabChange('nfts')
            Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_NFTS)
          }}
          className={({ selected }) =>
            clsx(
              'flex items-center space-x-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium uppercase transition duration-300 ease-in-out focus:outline-none',
              selected
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'hover:bg-gray-200 hover:dark:bg-gray-800'
            )
          }
        >
          <CollectOutline className="h-4 w-4" />
          <span>NFTs</span>
        </Tab>
        <Tab
          onClick={() => {
            handleTabChange('channels')
            Analytics.track(TRACK.CHANNEL.CLICK_OTHER_CHANNELS)
          }}
          className={({ selected }) =>
            clsx(
              'flex items-center space-x-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium uppercase transition duration-300 ease-in-out focus:outline-none',
              selected
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'hover:bg-gray-200 hover:dark:bg-gray-800'
            )
          }
        >
          <ChannelOutline className="h-4 w-4" />
          <span>Channels</span>
        </Tab>
        <Tab
          onClick={() => {
            handleTabChange('stats')
            Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_STATS)
          }}
          className={({ selected }) =>
            clsx(
              'flex items-center space-x-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium uppercase transition duration-300 ease-in-out focus:outline-none',
              selected
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'hover:bg-gray-200 hover:dark:bg-gray-800'
            )
          }
        >
          <GraphOutline className="h-4 w-4" />
          <span>Stats</span>
        </Tab>
        <Tab
          onClick={() => {
            handleTabChange('about')
            Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_ABOUT)
          }}
          className={({ selected }) =>
            clsx(
              'flex items-center space-x-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium uppercase transition duration-300 ease-in-out focus:outline-none',
              selected
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'hover:bg-gray-200 hover:dark:bg-gray-800'
            )
          }
        >
          <InfoOutline className="h-4 w-4" />
          <span>About</span>
        </Tab>
      </Tab.List>
      <Tab.Panels className="py-4 md:py-5">
        <Tab.Panel className="focus:outline-none">
          <ChannelVideos channel={channel} />
        </Tab.Panel>
        <Tab.Panel className="focus:outline-none">
          <ChannelBytes channel={channel} />
        </Tab.Panel>
        <Tab.Panel className="focus:outline-none">
          <CommentedVideos channel={channel} />
        </Tab.Panel>
        <Tab.Panel className="focus:outline-none">
          <MirroredVideos channel={channel} />
        </Tab.Panel>
        <Tab.Panel className="focus:outline-none">
          <CollectedNFTs channel={channel} />
        </Tab.Panel>
        <Tab.Panel className="focus:outline-none">
          <OtherChannels channel={channel} />
        </Tab.Panel>
        <Tab.Panel className="focus:outline-none">
          <ChannelStats channel={channel} />
        </Tab.Panel>
        <Tab.Panel className="focus:outline-none">
          <About channel={channel} />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  )
}

export default Tabs
