import type { Profile } from '@tape.xyz/lens'
import type { FC } from 'react'

import { getDateString, getRelativeTime } from '@lib/formatTime'
import { Badge as BadgeUI, Flex } from '@radix-ui/themes'
import {
  getProfile,
  getProfileCoverPicture,
  getProfilePicture,
  imageCdn,
  sanitizeDStorageUrl
} from '@tape.xyz/generic'
import React from 'react'

import CoverLinks from './CoverLinks'

type Props = {
  profile: Profile
}

const Cover: FC<Props> = ({ profile }) => {
  const coverImage = imageCdn(
    sanitizeDStorageUrl(getProfileCoverPicture(profile, true))
  )

  return (
    <div className="relative">
      <div
        className="ultrawide:h-[25vh] bg-brand-500 h-44 w-full bg-cover bg-center bg-no-repeat md:h-[20vw]"
        style={{
          backgroundImage: `url("${coverImage}")`
        }}
      />
      <div className="flex justify-center">
        <div className="container absolute bottom-4 mx-auto flex max-w-screen-xl items-end justify-between px-2 xl:px-0">
          <img
            alt={getProfile(profile)?.slug}
            className="laptop:size-32 rounded-small size-24 flex-none border-2 border-white bg-white shadow-2xl dark:bg-gray-900"
            draggable={false}
            src={getProfilePicture(profile, 'AVATAR_LG')}
          />
          <Flex align="end" direction="column" gap="4">
            {profile.metadata && <CoverLinks metadata={profile.metadata} />}

            <Flex gap="1">
              <BadgeUI className="!bg-white !text-black" title={profile.id}>
                <span className="bg-white text-black">
                  # {parseInt(profile.id)}
                </span>
              </BadgeUI>
              <BadgeUI
                className="!bg-white !text-black"
                title={getDateString(profile.createdAt)}
              >
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
