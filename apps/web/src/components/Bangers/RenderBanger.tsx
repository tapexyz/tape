import SignOutline from '@components/Common/Icons/SignOutline'
import { Button } from '@radix-ui/themes'
import { TAPE_WEBSITE_URL } from '@tape.xyz/constants'
import { getPublicationData } from '@tape.xyz/generic'
import type { PrimaryPublication } from '@tape.xyz/lens'
import React from 'react'

import Mirrors from './Mirrors'
import RenderLink from './RenderLink'

const RenderBanger = ({ post }: { post: PrimaryPublication }) => {
  return (
    <div className="ultrawide:space-y-8 hover:bg-gallery hover:dark:bg-smoke space-y-6 p-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Mirrors post={post} />
          <Button size="1" highContrast variant="surface">
            Co-sign
            <SignOutline className="h-3 w-3" />
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
