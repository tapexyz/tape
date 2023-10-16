import { Box, Tabs } from '@radix-ui/themes'
import { Analytics, TRACK } from '@tape.xyz/browser'
import { getProfile } from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React from 'react'

import OtherProfiles from './OtherProfiles'
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
    <div className="container mx-auto my-4 w-full max-w-[70rem] md:my-5">
      <Tabs.Root defaultValue={activeTab}>
        <Tabs.List>
          <Tabs.Trigger
            onClick={() => {
              handleTabChange('videos')
              Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_VIDEOS)
            }}
            value="videos"
          >
            Videos
          </Tabs.Trigger>
          <Tabs.Trigger
            onClick={() => {
              handleTabChange('bytes')
              Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_BYTES)
            }}
            value="bytes"
          >
            Bytes
          </Tabs.Trigger>
          <Tabs.Trigger
            onClick={() => {
              handleTabChange('channels')
              Analytics.track(TRACK.CHANNEL.CLICK_OTHER_CHANNELS)
            }}
            value="channels"
          >
            Channels
          </Tabs.Trigger>
        </Tabs.List>

        <Box pt="3">
          <Tabs.Content value="videos">
            <ProfileVideos profile={profile} />
          </Tabs.Content>

          <Tabs.Content value="bytes">
            <ProfileBytes profileId={profile.id} />
          </Tabs.Content>

          <Tabs.Content value="channels">
            <OtherProfiles profile={profile} />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </div>
  )
}

export default ProfileTabs
