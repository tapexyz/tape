import MetaTags from '@components/Common/MetaTags'
import { getProfile, getValueFromKeyInAttributes } from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import type { FC } from 'react'
import React from 'react'

import BasicInfo from './BasicInfo'
import Cover from './Cover'
import ProfileTabs from './Tabs'
import PinnedVideo from './Tabs/PinnedVideo'

interface Props {
  profile: Profile
}

const ViewProfile: FC<Props> = ({ profile }) => {
  // const { query } = useRouter()
  // const handle = query.handle as string
  // const id = query.id as string

  // useEffect(() => {
  //   Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.CHANNEL })
  // }, [])

  // const request: ProfileRequest = {
  //   ...(id ? { forProfileId: id } : { forHandle: `${HANDLE_PREFIX}${handle}` })
  // }

  // const { data, loading, error } = useProfileQuery({
  //   variables: {
  //     request
  //   },
  //   skip: id ? !id : !handle
  // })

  // if (error) {
  //   return <Custom500 />
  // }
  // if (loading) {
  //   return <ProfilePageShimmer />
  // }
  // if (!data?.profile) {
  //   return <Custom404 />
  // }

  // const profile = data?.profile as Profile
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
      {/* {!loading && !error && profile ? (
        <> */}
      <Cover profile={profile} />
      <div className="container mx-auto max-w-screen-xl px-2 xl:px-0">
        <BasicInfo profile={profile} />
        {pinnedVideoId?.length ? <PinnedVideo id={pinnedVideoId} /> : null}
        <ProfileTabs profile={profile} />
      </div>
    </>
    // ) : null}
    // </>
  )
}

export default ViewProfile
