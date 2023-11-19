import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import CommentsShimmer from '@components/Shimmers/CommentsShimmer'
import {
  INFINITE_SCROLL_ROOT_MARGIN,
  LENS_CUSTOM_FILTERS
} from '@dragverse/constants'
import type {
  AnyPublication,
  Comment,
  MirrorablePublication,
  PublicationsRequest
} from '@dragverse/lens'
import {
  CommentRankingFilterType,
  LimitType,
  usePublicationsQuery
} from '@dragverse/lens'
import { Loader } from '@dragverse/ui'
import { Button } from '@radix-ui/themes'
import type { FC } from 'react'
import { useState } from 'react'
import { useInView } from 'react-cool-inview'

import RenderComment from './RenderComment'

type Props = {
  video: MirrorablePublication
  className?: string
}

const NonRelevantComments: FC<Props> = ({ video, className }) => {
  const [showSection, setShowSection] = useState(false)

  const request: PublicationsRequest = {
    limit: LimitType.Fifty,
    where: {
      customFilters: LENS_CUSTOM_FILTERS,
      commentOn: {
        id: video.id,
        ranking: {
          filter: CommentRankingFilterType.NoneRelevant
        }
      }
    }
  }

  const { data, loading, fetchMore } = usePublicationsQuery({
    variables: { request }
  })

  const comments = data?.publications?.items as AnyPublication[]
  const pageInfo = data?.publications?.pageInfo

  const { observe } = useInView({
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
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
        highContrast
      >
        <span className="flex items-center space-x-2">
          <span className="opacity-80 group-hover:opacity-100">
            {showSection ? 'Hide more comments' : 'Show more comments'}
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
          <div className="space-y-4 py-6">
            {loading && <CommentsShimmer />}
            {comments?.map(
              (comment) =>
                !comment.isHidden && (
                  <RenderComment
                    key={`${comment?.id}_${comment.createdAt}`}
                    comment={comment as Comment}
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
