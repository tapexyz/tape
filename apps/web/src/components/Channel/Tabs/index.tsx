import BytesOutline from '@components/Common/Icons/BytesOutline'
import ChannelOutline from '@components/Common/Icons/ChannelOutline'
import CollectOutline from '@components/Common/Icons/CollectOutline'
import LinkOutline from '@components/Common/Icons/LinkOutline'
import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import { Tab } from '@headlessui/react'
import useAuthPersistStore from '@lib/store/auth'
import { Trans } from '@lingui/macro'
import { Analytics, TRACK } from '@tape.xyz/browser'
import { FEATURE_FLAGS } from '@tape.xyz/constants'
import { getIsFeatureEnabled, trimLensHandle } from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React from 'react'

import VideoOutline from '../../Common/Icons/VideoOutline'
import ChannelBytes from './ChannelBytes'
import ChannelVideos from './ChannelVideos'
import CollectedNFTs from './CollectedNFTs'
import MirroredVideos from './MirroredVideos'
import OtherProfiles from './OtherProfiles'
import SharedLinks from './SharedLinks'

type Props = {
  profile: Profile
}

const Tabs: FC<Props> = ({ profile }) => {
  const router = useRouter()
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  const getDefaultTab = () => {
    switch (router.query.tab) {
      case 'bytes':
        return 1
      case 'mirrors':
        return 2
      case 'links':
        return 3
      case 'nfts':
        return 4
      case 'channels':
        return 5
      case 'others':
        return 6
      default:
        return 0
    }
  }

  const handleTabChange = (tab: string) => {
    if (tab) {
      const nextUrl = `${location.origin}/channel/${trimLensHandle(
        profile.handle
      )}?tab=${tab}`
      history.replaceState({ path: nextUrl }, '', nextUrl)
    }
  }

  return (
    <Tab.Group
      as="div"
      className="container mx-auto mt-4 w-full max-w-[70rem] p-2 md:mt-5 2xl:px-0"
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
              'flex items-center space-x-2 whitespace-nowrap rounded-full border border-gray-200 px-4 py-2 text-xs font-medium uppercase transition duration-300 ease-in-out focus:outline-none dark:border-gray-800',
              selected
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'hover:bg-gray-200 hover:dark:bg-gray-800'
            )
          }
        >
          <VideoOutline className="h-4 w-4" />
          <span>
            <Trans>Videos</Trans>
          </span>
        </Tab>
        <Tab
          onClick={() => {
            handleTabChange('bytes')
            Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_BYTES)
          }}
          className={({ selected }) =>
            clsx(
              'flex items-center space-x-2 whitespace-nowrap rounded-full border border-gray-200 px-4 py-2 text-xs font-medium uppercase transition duration-300 ease-in-out focus:outline-none dark:border-gray-800',
              selected
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'hover:bg-gray-200 hover:dark:bg-gray-800'
            )
          }
        >
          <BytesOutline className="h-4 w-4" />
          <span>
            <Trans>Bytes</Trans>
          </span>
        </Tab>
        <Tab
          onClick={() => {
            handleTabChange('mirrors')
            Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_MIRRORS)
          }}
          className={({ selected }) =>
            clsx(
              'flex items-center space-x-2 whitespace-nowrap rounded-full border border-gray-200 px-4 py-2 text-xs font-medium uppercase transition duration-300 ease-in-out focus:outline-none dark:border-gray-800',
              selected
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'hover:bg-gray-200 hover:dark:bg-gray-800'
            )
          }
        >
          <MirrorOutline className="h-4 w-4" />
          <span>
            <Trans>Mirrors</Trans>
          </span>
        </Tab>
        <Tab
          onClick={() => {
            handleTabChange('links')
            Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_LINKS)
          }}
          className={({ selected }) =>
            clsx(
              'flex items-center space-x-2 whitespace-nowrap rounded-full border border-gray-200 px-4 py-2 text-xs font-medium uppercase transition duration-300 ease-in-out focus:outline-none dark:border-gray-800',
              selected
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'hover:bg-gray-200 hover:dark:bg-gray-800'
            )
          }
        >
          <LinkOutline className="h-4 w-4" />
          <span>
            <Trans>Links</Trans>
          </span>
        </Tab>
        {getIsFeatureEnabled(
          FEATURE_FLAGS.PROFILE_NFTS,
          selectedSimpleProfile?.id
        ) && (
          <Tab
            onClick={() => {
              handleTabChange('nfts')
              Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_NFTS)
            }}
            className={({ selected }) =>
              clsx(
                'flex items-center space-x-2 whitespace-nowrap rounded-full border border-gray-200 px-4 py-2 text-xs font-medium uppercase transition duration-300 ease-in-out focus:outline-none dark:border-gray-800',
                selected
                  ? 'bg-gray-200 dark:bg-gray-700'
                  : 'hover:bg-gray-200 hover:dark:bg-gray-800'
              )
            }
          >
            <CollectOutline className="h-4 w-4" />
            <span>NFTs</span>
          </Tab>
        )}
        <Tab
          onClick={() => {
            handleTabChange('channels')
            Analytics.track(TRACK.CHANNEL.CLICK_OTHER_CHANNELS)
          }}
          className={({ selected }) =>
            clsx(
              'flex items-center space-x-2 whitespace-nowrap rounded-full border border-gray-200 px-4 py-2 text-xs font-medium uppercase transition duration-300 ease-in-out focus:outline-none dark:border-gray-800',
              selected
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'hover:bg-gray-200 hover:dark:bg-gray-800'
            )
          }
        >
          <ChannelOutline className="h-4 w-4" />
          <span>
            <Trans>Channels</Trans>
          </span>
        </Tab>
      </Tab.List>
      <Tab.Panels className="py-4 md:py-5">
        <Tab.Panel className="focus:outline-none">
          <ChannelVideos profile={profile} />
        </Tab.Panel>
        <Tab.Panel className="focus:outline-none">
          <ChannelBytes profileId={profile.id} />
        </Tab.Panel>
        <Tab.Panel className="focus:outline-none">
          <MirroredVideos profileId={profile.id} />
        </Tab.Panel>
        <Tab.Panel className="focus:outline-none">
          <SharedLinks profileId={profile.id} />
        </Tab.Panel>
        <Tab.Panel className="focus:outline-none">
          <SharedLinks profileId={profile.id} />
        </Tab.Panel>
        <Tab.Panel className="focus:outline-none">
          <SharedLinks profileId={profile.id} />
        </Tab.Panel>
        {getIsFeatureEnabled(
          FEATURE_FLAGS.PROFILE_NFTS,
          selectedSimpleProfile?.id
        ) && (
          <Tab.Panel className="focus:outline-none">
            <CollectedNFTs profile={profile} />
          </Tab.Panel>
        )}
        <Tab.Panel className="focus:outline-none">
          <OtherProfiles profile={profile} />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  )
}

export default Tabs
