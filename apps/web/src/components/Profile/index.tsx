import MetaTags from '@components/Common/MetaTags'
import ProfilePageShimmer from '@components/Shimmers/ProfilePageShimmer'
import { Analytics, TRACK } from '@tape.xyz/browser'
import {
  getProfile,
  getValueFromKeyInAttributes,
  trimLensHandle
} from '@tape.xyz/generic'
import type { Profile, ProfileRequest } from '@tape.xyz/lens'
import { useProfileQuery } from '@tape.xyz/lens'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'

import BasicInfo from './BasicInfo'
import Cover from './Cover'
import ProfileTabs from './Tabs'
import PinnedVideo from './Tabs/PinnedVideo'

const Channel = () => {
  const { query } = useRouter()
  const handle = query.profile as string
  const isId = handle.startsWith('0x')

  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.CHANNEL })
  }, [])

  const request: ProfileRequest = {
    forProfileId: isId ? handle : undefined,
    forHandle: !isId ? `test/@${trimLensHandle(handle)}` : undefined
  }

  const { data, loading, error } = useProfileQuery({
    variables: {
      request
    },
    skip: !handle
  })

  if (error) {
    return <Custom500 />
  }
  if (loading) {
    return <ProfilePageShimmer />
  }
  if (!data?.profile) {
    return <Custom404 />
  }

  const profile = data?.profile as Profile
  const pinnedVideoId = getValueFromKeyInAttributes(
    profile?.metadata?.attributes,
    'pinnedPublicationId'
  )
  return (
    <>
      <MetaTags
        title={`${getProfile(profile)?.displayName} (${getProfile(profile)
          ?.slugWithPrefix})`}
      />
      {!loading && !error && profile ? (
        <>
          <Cover profile={profile} />
          <div className="container mx-auto max-w-screen-xl px-2 xl:px-0">
            <BasicInfo profile={profile} />
            {pinnedVideoId?.length ? <PinnedVideo id={pinnedVideoId} /> : null}
            <ProfileTabs profile={profile} />
          </div>
        </>
      ) : null}
    </>
  )
}

export default Channel
