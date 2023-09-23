import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import CommentsShimmer from '@components/Shimmers/CommentsShimmer'
import { Button } from '@components/UIElements/Button'
import { LENS_CUSTOM_FILTERS, SCROLL_ROOT_MARGIN } from '@lenstube/constants'
import type {
  Comment,
  MirrorablePublication,
  PublicationsRequest
} from '@lenstube/lens'
import {
  LimitType,
  PublicationsOrderByType,
  usePublicationsQuery
} from '@lenstube/lens'
import { Loader } from '@lenstube/ui'
import { t } from '@lingui/macro'
import type { FC } from 'react'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'

import RenderComment from './RenderComment'

type Props = {
  video: MirrorablePublication
  className?: string
}

const NonRelevantComments: FC<Props> = ({ video, className }) => {
  const [showSection, setShowSection] = useState(false)

  const request: PublicationsRequest = {
    limit: LimitType.TwentyFive,
    where: {
      customFilters: LENS_CUSTOM_FILTERS,

      commentOn: video.id
    },
    orderBy: PublicationsOrderByType.CommentOfQueryRanking
  }

  const { data, loading, fetchMore } = usePublicationsQuery({
    variables: { request }
  })

  const comments = data?.publications?.items as Comment[]
  const pageInfo = data?.publications?.pageInfo

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    }
  })

  const onToggle = () => {
    setShowSection(!showSection)
  }

  if (!comments?.length) {
    return null
  }

  return (
    <div className={className}>
      <Button
        className="group w-full text-center"
        onClick={() => onToggle()}
        variant="outline"
        size="lg"
      >
        <span className="flex items-center space-x-2">
          <span className="opacity-70 group-hover:opacity-100">
            {showSection ? t`Hide more comments` : t`Show more comments`}
          </span>
          {showSection ? (
            <ChevronUpOutline className="h-3 w-3" />
          ) : (
            <ChevronDownOutline className="h-3 w-3" />
          )}
        </span>
      </Button>
      {showSection ? (
        <>
          <div className="space-y-4 pt-6">
            {loading && <CommentsShimmer />}
            {comments?.map(
              (comment) =>
                !comment.isHidden && (
                  <RenderComment
                    key={`${comment?.id}_${comment.createdAt}`}
                    comment={comment}
                  />
                )
            )}
          </div>
          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </>
      ) : null}
    </div>
  )
}

export default NonRelevantComments
