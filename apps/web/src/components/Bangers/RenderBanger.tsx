import HoverableProfile from '@components/Common/HoverableProfile'
import { Avatar, Button } from '@radix-ui/themes'
import { TAPE_WEBSITE_URL } from '@tape.xyz/constants'
import {
  getProfile,
  getProfilePicture,
  getPublicationData
} from '@tape.xyz/generic'
import type { PrimaryPublication } from '@tape.xyz/lens'
import React from 'react'

import RenderLink from './RenderLink'

const RenderBanger = ({ post }: { post: PrimaryPublication }) => {
  return (
    <div className="ultrawide:space-y-8 space-y-6 py-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center -space-x-2">
            <HoverableProfile profile={post.by}>
              <Avatar
                radius="full"
                src={getProfilePicture(post.by)}
                fallback={getProfile(post.by)?.displayName}
                alt={getProfile(post.by)?.displayName}
              />
            </HoverableProfile>
          </div>
          <Button highContrast variant="soft">
            Youtube
          </Button>
        </div>
        <div className="rounded-small overflow-hidden">
          <RenderLink
            link={
              getPublicationData(post.metadata)?.content ?? TAPE_WEBSITE_URL
            }
          />
        </div>
      </div>
    </div>
  )
}

export default RenderBanger
