import Badge from '@components/Common/Badge'
import HoverableProfile from '@components/Common/HoverableProfile'
import MetaTags from '@components/Common/MetaTags'
import Stats from '@components/Profile/BasicInfo/Stats'
import useProfileStore from '@lib/store/profile'
import { Avatar, Flex } from '@radix-ui/themes'
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
      <div className="tape-border rounded-medium dark:bg-cod mb-4 bg-white p-5">
        <MetaTags title="Danger Zone" />
        <Flex align="center" justify="between">
          <div className="flex items-center">
            <div className="mr-3 mt-0.5 flex-none">
              <HoverableProfile profile={activeProfile}>
                <Avatar
                  src={getProfilePicture(activeProfile, 'AVATAR')}
                  fallback={getProfile(activeProfile)?.displayName[0] ?? ';)'}
                  radius="full"
                  className="h-9 w-9 rounded-full"
                  draggable={false}
                  alt={getProfile(activeProfile)?.displayName}
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
        </Flex>
      </div>
      <Guardian />
      <Delete />
    </>
  )
}

export default DangerZone
