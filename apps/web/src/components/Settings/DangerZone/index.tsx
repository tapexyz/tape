import Badge from '@components/Common/Badge'
import HoverableProfile from '@components/Common/HoverableProfile'
import MetaTags from '@components/Common/MetaTags'
import Stats from '@components/Profile/BasicInfo/Stats'
import useProfileStore from '@lib/store/idb/profile'
import { getProfile, getProfilePicture } from '@tape.xyz/generic'
import React from 'react'

import Delete from './Delete'
import Guardian from './Guardian'

const DangerZone = () => {
  const activeProfile = useProfileStore((state) => state.activeProfile)

  if (!activeProfile) {
    return null
  }

  return (
    <>
      <MetaTags title="Danger Zone" />
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3 mt-0.5 flex-none">
            <HoverableProfile profile={activeProfile}>
              <img
                src={getProfilePicture(activeProfile, 'AVATAR')}
                className="size-10 rounded-full"
                alt={getProfile(activeProfile)?.displayName}
                draggable={false}
              />
            </HoverableProfile>
          </div>
          <div className="flex flex-col">
            <h6 className="font-medium">
              {getProfile(activeProfile)?.displayName}
            </h6>
            <span className="flex items-center space-x-1">
              <p>{getProfile(activeProfile)?.slugWithPrefix}</p>
              <Badge id={activeProfile?.id} size="sm" />
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Stats profile={activeProfile} />
        </div>
      </div>
      <Guardian />
      <Delete />
    </>
  )
}

export default DangerZone
