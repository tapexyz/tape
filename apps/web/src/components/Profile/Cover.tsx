import { getDateString, getRelativeTime } from '@lib/formatTime'
import { TAPE_SIGNUP_PROXY_ABI } from '@tape.xyz/abis'
import { STATIC_ASSETS, TAPE_SIGNUP_PROXY_ADDRESS } from '@tape.xyz/constants'
import {
  getProfile,
  getProfileCoverPicture,
  getProfilePicture,
  imageCdn,
  sanitizeDStorageUrl
} from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import { Badge as BadgeUI, Tooltip } from '@tape.xyz/ui'
import type { FC } from 'react'
import React from 'react'
import { useReadContract } from 'wagmi'

import CoverLinks from './CoverLinks'

type Props = {
  profile: Profile
}

const Cover: FC<Props> = ({ profile }) => {
  const coverImage = imageCdn(
    sanitizeDStorageUrl(getProfileCoverPicture(profile, true))
  )

  const { data: isMintedViaTape } = useReadContract({
    abi: TAPE_SIGNUP_PROXY_ABI,
    address: TAPE_SIGNUP_PROXY_ADDRESS,
    args: [profile.id],
    functionName: 'profiles'
  })

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
          <div className="relative">
            <img
              className="laptop:size-32 rounded-small size-24 flex-none border-2 border-white bg-white shadow-2xl dark:bg-gray-900"
              src={getProfilePicture(profile, 'AVATAR_LG')}
              draggable={false}
              alt={getProfile(profile)?.slug}
            />
            {Boolean(isMintedViaTape) && (
              <Tooltip content="Profile minted via Tape">
                <span className="absolute bottom-1 right-1">
                  <img
                    className="size-6 rounded-full"
                    src={imageCdn(`${STATIC_ASSETS}/brand/logo.png`, 'AVATAR')}
                    alt="logo"
                    draggable={false}
                  />
                </span>
              </Tooltip>
            )}
          </div>
          <div className="flex flex-col items-end gap-4">
            {profile.metadata && <CoverLinks metadata={profile.metadata} />}

            <div className="flex gap-1">
              <BadgeUI title={profile.id} className="!bg-white !text-black">
                <span className="bg-white text-black">
                  # {parseInt(profile.id)}
                </span>
              </BadgeUI>
              <BadgeUI
                title={getDateString(profile.createdAt)}
                className="!bg-white !text-black"
              >
                Joined {getRelativeTime(profile.createdAt)}
              </BadgeUI>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cover
