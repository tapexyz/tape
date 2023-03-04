import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import CommentsShimmer from '@components/Shimmers/CommentsShimmer'
import { Button } from '@components/UIElements/Button'
import { Loader } from '@components/UIElements/Loader'
import useAppStore from '@lib/store'
import type { Publication } from 'lens'
import {
  CommentOrderingTypes,
  CommentRankingFilter,
  PublicationMainFocus,
  useCommentsQuery
} from 'lens'
import type { FC } from 'react'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import { LENS_CUSTOM_FILTERS, SCROLL_ROOT_MARGIN } from 'utils'

import Comment from './Comment'

type Props = {
  video: Publication
  className?: string
}

const NonRelevantComments: FC<Props> = ({ video, className }) => {
  const [showSection, setShowSection] = useState(false)
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  const request = {
    limit: 10,
    customFilters: LENS_CUSTOM_FILTERS,
    commentsOf: video.id,
    metadata: {
      mainContentFocus: [
        PublicationMainFocus.Video,
        PublicationMainFocus.Article,
        PublicationMainFocus.Embed,
        PublicationMainFocus.Link,
        PublicationMainFocus.TextOnly
      ]
    },
    commentsOfOrdering: CommentOrderingTypes.Ranking,
    commentsRankingFilter: CommentRankingFilter.NoneRelevant
  }
  const variables = {
    request,
    reactionRequest: selectedChannel
      ? { profileId: selectedChannel?.id }
      : null,
    channelId: selectedChannel?.id ?? null
  }

  const { data, loading, fetchMore } = useCommentsQuery({
    variables
  })

  const comments = data?.publications?.items as Publication[]
  const pageInfo = data?.publications?.pageInfo

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          ...variables,
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
          <div className="space-y-4 pt-6">
            {loading && <CommentsShimmer />}
            {comments?.map(
              (comment: Publication) =>
                !comment.hidden && (
                  <Comment
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
