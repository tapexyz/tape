import PublicationReaction from '@components/Common/Publication/PublicationReaction'
import { getDateString, getRelativeTime } from '@lib/formatTime'
import { TAPE_WEBSITE_URL } from '@tape.xyz/constants'
import { getPublicationData } from '@tape.xyz/generic'
import type { PrimaryPublication } from '@tape.xyz/lens'
import { FireOutline, Tooltip } from '@tape.xyz/ui'
import React from 'react'

import Likes from './Likes'
import RenderLink from './RenderLink'

const RenderBanger = ({
  post,
  isCertifiedBanger
}: {
  post: PrimaryPublication
  isCertifiedBanger: boolean
}) => {
  return (
    <div className="ultrawide:space-y-8 tape-border hover:bg-gallery/50 hover:dark:bg-smoke space-y-6 !border-x-0 !border-t-0 p-2 md:p-5">
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Likes post={post} />
            {isCertifiedBanger && (
              <Tooltip content="Certified Banger" placement="top">
                <span className="ml-2 text-red-500">
                  <FireOutline className="size-5" />
                </span>
              </Tooltip>
            )}
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
            <PublicationReaction publication={post} label="Banger" />
          </div>
          <p className="text-sm" title={getDateString(post.createdAt)}>
            {getRelativeTime(post.createdAt)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default RenderBanger
