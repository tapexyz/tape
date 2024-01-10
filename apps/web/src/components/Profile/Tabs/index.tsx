import * as Tabs from '@radix-ui/react-tabs'
import { EVENTS, getProfile, Tower } from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React from 'react'

import OtherProfiles from './OtherProfiles'
import ProfileAudios from './ProfileAudios'
import ProfileBytes from './ProfileBytes'
import ProfileVideos from './ProfileVideos'

type Props = {
  profile: Profile
}

const ProfileTabs: FC<Props> = ({ profile }) => {
  const router = useRouter()

  const handleTabChange = (tab: string) => {
    if (tab) {
      const nextUrl = `${location.origin}/u/${getProfile(profile)
        ?.slug}?tab=${tab}`
      history.replaceState({ path: nextUrl }, '', nextUrl)
    }
  }

  const activeTab = (router.query.tab ?? 'videos') as string

  return (
    <div className="my-4 w-full md:my-5">
      <Tabs.Root defaultValue={activeTab}>
        <Tabs.List>
          <Tabs.Trigger
            className="rounded-t-lg border-black px-4 py-1.5 text-sm font-medium data-[state=active]:border-b data-[state=active]:bg-gray-100 dark:border-white data-[state=active]:dark:bg-gray-800"
            onClick={() => {
              handleTabChange('videos')
              Tower.track(EVENTS.PROFILE.CLICK_PROFILE_VIDEOS)
            }}
            value="videos"
          >
            Videos
          </Tabs.Trigger>
          <Tabs.Trigger
            className="rounded-t-lg border-black px-4 py-1.5 text-sm font-medium data-[state=active]:border-b data-[state=active]:bg-gray-100 dark:border-white data-[state=active]:dark:bg-gray-800"
            onClick={() => {
              handleTabChange('audios')
              Tower.track(EVENTS.PROFILE.CLICK_PROFILE_AUDIOS)
            }}
            value="audios"
          >
            Audios
          </Tabs.Trigger>
          <Tabs.Trigger
            className="rounded-t-lg border-black px-4 py-1.5 text-sm font-medium data-[state=active]:border-b data-[state=active]:bg-gray-100 dark:border-white data-[state=active]:dark:bg-gray-800"
            onClick={() => {
              handleTabChange('bytes')
              Tower.track(EVENTS.PROFILE.CLICK_PROFILE_BYTES)
            }}
            value="bytes"
          >
            Bytes
          </Tabs.Trigger>
          <Tabs.Trigger
            className="rounded-t-lg border-black px-4 py-1.5 text-sm font-medium data-[state=active]:border-b data-[state=active]:bg-gray-100 dark:border-white data-[state=active]:dark:bg-gray-800"
            onClick={() => {
              handleTabChange('channels')
              Tower.track(EVENTS.PROFILE.CLICK_OTHER_PROFILES)
            }}
            value="channels"
          >
            Channels
          </Tabs.Trigger>
        </Tabs.List>

        <div className="pt-3">
          <Tabs.Content value="videos">
            <ProfileVideos profile={profile} />
          </Tabs.Content>

          <Tabs.Content value="audios">
            <ProfileAudios profile={profile} />
          </Tabs.Content>

          <Tabs.Content value="bytes">
            <ProfileBytes profileId={profile.id} />
          </Tabs.Content>

          <Tabs.Content value="channels">
            <OtherProfiles currentProfile={profile} />
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  )
}

export default ProfileTabs
