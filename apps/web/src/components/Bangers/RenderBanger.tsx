import SignOutline from '@components/Common/Icons/SignOutline'
import MirrorVideo from '@components/Common/MirrorVideo'
import PublicationReaction from '@components/Common/Publication/PublicationReaction'
import { getDateString, getRelativeTime } from '@lib/formatTime'
import { Button, Text } from '@radix-ui/themes'
import { TAPE_WEBSITE_URL } from '@tape.xyz/constants'
import { getPublicationData } from '@tape.xyz/generic'
import type { PrimaryPublication } from '@tape.xyz/lens'
import React from 'react'

import Mirrors from './Mirrors'
import RenderLink from './RenderLink'

const RenderBanger = ({ post }: { post: PrimaryPublication }) => {
  return (
    <div className="ultrawide:space-y-8 tape-border hover:bg-gallery/50 hover:dark:bg-smoke space-y-6 !border-x-0 !border-t-0 p-5">
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Mirrors post={post} />
          </div>
          <div>
            <RenderLink
              link={
                getPublicationData(post.metadata)?.content ?? TAPE_WEBSITE_URL
              }
            />
          </div>
        </div>
        <div className="mx-2 flex items-center justify-between space-x-2">
          <div className="flex items-center justify-between space-x-4">
            <PublicationReaction publication={post} />
            <MirrorVideo video={post} successToast="Co-signed successfully.">
              <div className="flex">
                <Button size="1" highContrast variant="ghost">
                  <SignOutline className="h-3.5 w-3.5" />
                  Co-sign
                </Button>
              </div>
            </MirrorVideo>
          </div>
          <Text size="1" title={getDateString(post.createdAt)}>
            {getRelativeTime(post.createdAt)}
          </Text>
        </div>
      </div>
    </div>
  )
}

export default RenderBanger
