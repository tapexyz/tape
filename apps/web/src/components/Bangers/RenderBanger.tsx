import SignOutline from '@components/Common/Icons/SignOutline'
import PublicationReaction from '@components/Watch/PublicationReaction'
import { Button } from '@radix-ui/themes'
import { TAPE_WEBSITE_URL } from '@tape.xyz/constants'
import { getPublicationData } from '@tape.xyz/generic'
import type { PrimaryPublication } from '@tape.xyz/lens'
import React from 'react'

import Mirrors from './Mirrors'
import RenderLink from './RenderLink'

const RenderBanger = ({ post }: { post: PrimaryPublication }) => {
  return (
    <div className="ultrawide:space-y-8 hover:bg-gallery/50 hover:dark:bg-smoke space-y-6 p-5">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Mirrors post={post} />
          </div>
          <div className="rounded-small overflow-hidden">
            <RenderLink
              link={
                getPublicationData(post.metadata)?.content ?? TAPE_WEBSITE_URL
              }
            />
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <PublicationReaction publication={post} />
          <Button size="1" highContrast variant="ghost">
            Co-sign
            <SignOutline className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RenderBanger
