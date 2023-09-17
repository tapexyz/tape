import {
  getChannelCoverPicture,
  getProfilePicture,
  imageCdn,
  sanitizeDStorageUrl,
  trimLensHandle
} from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import Tippy from '@tippyjs/react'
import Link from 'next/link'
import type { FC, ReactNode } from 'react'
import React from 'react'

import Badge from './Badge'
import InterweaveContent from './InterweaveContent'
import SubscribeActions from './SubscribeActions'

type Props = {
  profile: Profile
  children: ReactNode
}

const UserPreview: FC<Props> = ({ profile, children }) => {
  const Preview = () => {
    return (
      <>
        <div
          style={{
            backgroundImage: `url(${imageCdn(
              sanitizeDStorageUrl(getChannelCoverPicture(profile))
            )})`
          }}
          className="relative h-20 w-full bg-white bg-cover bg-center bg-no-repeat dark:bg-gray-900"
        >
          <div className="absolute bottom-2 right-2 flex-none">
            <img
              className="h-12 w-12 rounded-xl border-2 border-white bg-white object-cover dark:bg-gray-900"
              src={getProfilePicture(profile, 'AVATAR_LG')}
              draggable={false}
              alt={profile?.handle}
            />
          </div>
        </div>
        <div className="p-2 pl-4 pt-2.5">
          <div className="flex items-center justify-between">
            <Link
              href={`/channel/${trimLensHandle(profile?.handle)}`}
              className="flex items-center space-x-1"
            >
              <span className="text-2xl font-semibold leading-tight">
                {trimLensHandle(profile?.handle)}
              </span>
              <Badge id={profile?.id} size="lg" />
            </Link>
            {!profile.isFollowedByMe && (
              <SubscribeActions
                channel={profile}
                showText={false}
                variant="outline"
                subscribeType={profile?.followModule?.__typename}
              />
            )}
          </div>
          {profile?.bio && (
            <div className="line-clamp-4 py-2">
              <InterweaveContent content={profile?.bio} />
            </div>
          )}
        </div>
      </>
    )
  }

  return (
    <Tippy
      placement="bottom-start"
      delay={[100, 0]}
      hideOnClick={false}
      content={<Preview />}
      arrow={false}
      interactive
      zIndex={1000}
      className="preview-tippy-content hidden w-72 overflow-hidden !rounded-xl border !bg-white !text-black dark:border-gray-700 dark:!bg-black dark:!text-white md:block"
      appendTo={() => document.body}
    >
      <span>{children}</span>
    </Tippy>
  )
}

export default UserPreview
