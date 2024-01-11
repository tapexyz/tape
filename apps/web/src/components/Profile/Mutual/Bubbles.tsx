import HoverableProfile from '@components/Common/HoverableProfile'
import BubblesShimmer from '@components/Shimmers/BubblesShimmer'
import useProfileStore from '@lib/store/idb/profile'
import { getProfile, getProfilePicture } from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import { LimitType, useMutualFollowersQuery } from '@tape.xyz/lens'
import { Modal } from '@tape.xyz/ui'
import type { FC } from 'react'
import React, { useState } from 'react'

import MutualFollowers from './MutualFollowers'

type Props = {
  viewing: string
  showSeparator?: boolean
}

const Bubbles: FC<Props> = ({ viewing, showSeparator }) => {
  const { activeProfile } = useProfileStore()
  const [showModal, setShowModal] = useState(false)

  const { data, loading } = useMutualFollowersQuery({
    variables: {
      request: {
        observer: activeProfile?.id,
        viewing,
        limit: LimitType.Ten
      }
    },
    skip: !viewing || !activeProfile?.id
  })

  const mutualFollowers = data?.mutualFollowers?.items as Profile[]

  if (loading) {
    return <BubblesShimmer />
  }

  if (!mutualFollowers?.length) {
    return null
  }

  return (
    <>
      <button onClick={() => setShowModal(true)} className="flex items-center">
        {showSeparator && <span className="middot px-1" />}
        <div className="flex items-center gap-1">
          <span className="flex cursor-pointer -space-x-1.5">
            {mutualFollowers.slice(0, 3)?.map((profile: Profile) => (
              <HoverableProfile profile={profile} key={profile?.id}>
                <img
                  className="size-7 flex-none rounded-full border bg-white dark:border-gray-700/80"
                  src={getProfilePicture(profile, 'AVATAR')}
                  draggable={false}
                  alt={getProfile(profile)?.slug}
                />
              </HoverableProfile>
            ))}
            {mutualFollowers.length > 4 && (
              <div className="flex size-7 flex-none items-center justify-center rounded-full border border-gray-300 bg-gray-200 dark:border-gray-600 dark:bg-gray-800">
                <span role="img" className="text-sm">
                  👀
                </span>
              </div>
            )}
          </span>
        </div>
      </button>
      <Modal
        size="sm"
        title="People you may know"
        show={showModal}
        setShow={setShowModal}
      >
        <div className="no-scrollbar max-h-[70vh] overflow-y-auto">
          <MutualFollowers viewing={viewing} />
        </div>
      </Modal>
    </>
  )
}

export default Bubbles
