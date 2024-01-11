import HoverableProfile from '@components/Common/HoverableProfile'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { formatNumber, getProfile, getProfilePicture } from '@tape.xyz/generic'
import type { FollowersRequest, Profile, ProfileStats } from '@tape.xyz/lens'
import { LimitType, useFollowersQuery } from '@tape.xyz/lens'
import { Modal, Spinner } from '@tape.xyz/ui'
import type { FC } from 'react'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'

type Props = {
  stats: ProfileStats
  profileId: string
}

const Followers: FC<Props> = ({ stats, profileId }) => {
  const [showModal, setShowModal] = useState(false)

  const request: FollowersRequest = {
    of: profileId,
    limit: LimitType.Fifty
  }

  const { data, loading, fetchMore } = useFollowersQuery({
    variables: { request },
    skip: !profileId
  })

  const followers = data?.followers?.items as Profile[]
  const pageInfo = data?.followers?.pageInfo

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

  return (
    <>
      <button
        className="flex items-end gap-1"
        onClick={() => setShowModal(true)}
      >
        <span className="font-bold">{formatNumber(stats.followers)}</span>
        <span>Followers</span>
      </button>

      <Modal
        size="sm"
        title={`${formatNumber(stats.followers)} followers`}
        show={showModal}
        setShow={setShowModal}
      >
        <div className="no-scrollbar max-h-[70vh] overflow-y-auto">
          {loading && <Spinner />}
          {followers?.length === 0 && (
            <div className="pt-5">
              <NoDataFound withImage isCenter />
            </div>
          )}
          <div className="space-y-2">
            {followers?.map((profile) => (
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
          </div>
          {pageInfo?.next && (
            <span ref={observe} className="p-5">
              <Spinner />
            </span>
          )}
        </div>
      </Modal>
    </>
  )
}

export default Followers
