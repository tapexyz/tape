import HoverableProfile from '@components/Common/HoverableProfile'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useProfileStore from '@lib/store/idb/profile'
import { getProfile, getProfilePicture } from '@tape.xyz/generic'
import type { MutualFollowersRequest, Profile } from '@tape.xyz/lens'
import { LimitType, useMutualFollowersQuery } from '@tape.xyz/lens'
import { Spinner } from '@tape.xyz/ui'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'

type Props = {
  viewing: string
}

const MutualFollowers: FC<Props> = ({ viewing }) => {
  const { activeProfile } = useProfileStore()

  const request: MutualFollowersRequest = {
    viewing,
    observer: activeProfile?.id,
    limit: LimitType.Fifty
  }

  const { data, loading, fetchMore } = useMutualFollowersQuery({
    variables: {
      request
    },
    skip: !viewing
  })

  const mutualFollowers = data?.mutualFollowers?.items as Profile[]
  const pageInfo = data?.mutualFollowers?.pageInfo

  const { observe } = useInView({
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    }
  })

  if (loading) {
    return <Spinner />
  }
  if (mutualFollowers?.length === 0) {
    return (
      <div className="pt-5">
        <NoDataFound text="No mutual followers" withImage isCenter />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {loading && <Spinner />}
      {mutualFollowers?.length === 0 && (
        <div className="pt-5">
          <NoDataFound withImage isCenter />
        </div>
      )}
      {mutualFollowers?.map((profile: Profile) => (
        <div key={profile.id}>
          <span className="inline-flex">
            <HoverableProfile
              profile={profile}
              pfp={
                <img
                  src={getProfilePicture(profile, 'AVATAR')}
                  className="size-5 rounded-full"
                  draggable={false}
                  alt={getProfile(profile)?.displayName}
                />
              }
            />
          </span>
        </div>
      ))}
      {pageInfo?.next && (
        <span ref={observe} className="p-5">
          <Spinner />
        </span>
      )}
    </div>
  )
}

export default MutualFollowers
