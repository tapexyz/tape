import MetaTags from '@components/Common/MetaTags'
import ProfilePageShimmer from '@components/Shimmers/ProfilePageShimmer'
import { LENS_NAMESPACE_PREFIX } from '@tape.xyz/constants'
import {
  EVENTS,
  getProfile,
  getValueFromKeyInAttributes,
  Tower
} from '@tape.xyz/generic'
import type { Profile, ProfileRequest } from '@tape.xyz/lens'
import { useProfileQuery } from '@tape.xyz/lens'
import { useRouter } from 'next/router'
import React, { memo, useEffect } from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'

import BasicInfo from './BasicInfo'
import Cover from './Cover'
import ProfileTabs from './Tabs'
import PinnedVideo from './Tabs/PinnedVideo'

const ViewProfile = () => {
  const { query } = useRouter()
  const handle = query.handle as string[]
  const forProfileId = query.id as string

  useEffect(() => {
    Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.PROFILE })
  }, [])

  const forHandle =
    handle?.length > 1 ? handle.join('/') : `${LENS_NAMESPACE_PREFIX}${handle}`
  const request: ProfileRequest = {
    ...(forProfileId ? { forProfileId } : { forHandle })
  }

  const { data, loading, error } = useProfileQuery({
    variables: {
      request
    },
    skip: !forProfileId && !handle
  })

  if (loading || !data) {
    return <ProfilePageShimmer />
  }

  if (!data?.profile) {
    return <Custom404 />
  }

  if (error) {
    return <Custom500 />
  }

  const profile = data?.profile as Profile
  const pinnedVideoId = getValueFromKeyInAttributes(
    profile?.metadata?.attributes,
    'pinnedPublicationId'
  )

  const slugWithPrefix = getProfile(profile)?.slugWithPrefix
  const displayName = getProfile(profile)?.displayName

  return (
    <>
      <MetaTags title={`${displayName} (${slugWithPrefix})`} />
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

export default memo(ViewProfile)
