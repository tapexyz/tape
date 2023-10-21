import { getRelativeTime } from '@lib/formatTime'
import { Badge as BadgeUI, Flex } from '@radix-ui/themes'
import {
  getProfile,
  getProfileCoverPicture,
  getProfilePicture,
  imageCdn,
  sanitizeDStorageUrl
} from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import type { FC } from 'react'
import React from 'react'

import CoverLinks from './CoverLinks'

type Props = {
  profile: Profile
}

const Cover: FC<Props> = ({ profile }) => {
  const coverImage = imageCdn(
    sanitizeDStorageUrl(getProfileCoverPicture(profile))
  )

  return (
    <div className="relative">
      <div
        style={{
          backgroundImage: `url("${coverImage}")`
        }}
        className="ultrawide:h-[25vh] bg-brand-500 h-44 w-full bg-cover bg-center bg-no-repeat md:h-[20vw]"
      />
      <div className="flex justify-center">
        <div className="container absolute bottom-4 mx-auto flex max-w-screen-xl items-end justify-between px-2 xl:px-0">
          <img
            className="ultrawide:h-32 ultrawide:w-32 rounded-small h-24 w-24 flex-none border-2 border-white bg-white shadow-2xl dark:bg-gray-900"
            src={getProfilePicture(profile, 'AVATAR_LG')}
            draggable={false}
            alt={getProfile(profile)?.slug}
          />
          <Flex direction="column" gap="4" align="end">
            {profile.metadata && <CoverLinks metadata={profile.metadata} />}

            <Flex gap="1">
              <BadgeUI className="!bg-white !text-black">
                <span className="bg-white text-black">
                  # {parseInt(profile.id)}
                </span>
              </BadgeUI>
              <BadgeUI className="!bg-white !text-black">
                Joined {getRelativeTime(profile.createdAt)}
              </BadgeUI>
            </Flex>
          </Flex>
        </div>
      </div>
    </div>
  )
}

export default Cover
