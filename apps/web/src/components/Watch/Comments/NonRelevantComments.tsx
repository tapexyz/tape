import type {
  AnyPublication,
  Comment,
  MirrorablePublication,
  PublicationsRequest
} from '@tape.xyz/lens'
import type { FC } from 'react'

import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import CommentsShimmer from '@components/Shimmers/CommentsShimmer'
import { Button } from '@radix-ui/themes'
import {
  INFINITE_SCROLL_ROOT_MARGIN,
  LENS_CUSTOM_FILTERS
} from '@tape.xyz/constants'
import {
  CommentRankingFilterType,
  LimitType,
  usePublicationsQuery
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'

import RenderComment from './RenderComment'

type Props = {
  className?: string
  video: MirrorablePublication
}

const NonRelevantComments: FC<Props> = ({ className, video }) => {
  const [showSection, setShowSection] = useState(false)

  const request: PublicationsRequest = {
    limit: LimitType.Fifty,
    where: {
      commentOn: {
        id: video.id,
        ranking: {
          filter: CommentRankingFilterType.NoneRelevant
        }
      },
      customFilters: LENS_CUSTOM_FILTERS
    }
  }

  const { data, fetchMore, loading } = usePublicationsQuery({
    variables: { request }
  })

  const comments = data?.publications?.items as AnyPublication[]
  const pageInfo = data?.publications?.pageInfo

  const { observe } = useInView({
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    },
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN
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
        highContrast
        onClick={() => onToggle()}
        variant="outline"
      >
        <span className="flex items-center space-x-2">
          <span className="opacity-80 group-hover:opacity-100">
            {showSection ? 'Hide more comments' : 'Show more comments'}
          </span>
          {showSection ? (
            <ChevronUpOutline className="size-3" />
          ) : (
            <ChevronDownOutline className="size-3" />
          )}
        </span>
      </Button>
      {showSection ? (
        <>
          <div className="space-y-4 py-6">
            {loading && <CommentsShimmer />}
            {comments?.map(
              (comment) =>
                !comment.isHidden && (
                  <RenderComment
                    comment={comment as Comment}
                    key={`${comment?.id}_${comment.createdAt}`}
                  />
                )
            )}
          </div>
          {pageInfo?.next && (
            <span className="flex justify-center p-10" ref={observe}>
              <Loader />
            </span>
          )}
        </>
      ) : null}
    </div>
  )
}

export default NonRelevantComments
