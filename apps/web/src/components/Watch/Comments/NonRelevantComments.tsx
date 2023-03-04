import CommentsShimmer from '@components/Shimmers/CommentsShimmer'
import { Button } from '@components/UIElements/Button'
import { Loader } from '@components/UIElements/Loader'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
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
}

const NonRelevantComments: FC<Props> = ({ video }) => {
  const [showSection, setShowSection] = useState(false)
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const queuedComments = usePersistStore((state) => state.queuedComments)
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  const request = {
    limit: 30,
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
    variables,
    skip: !video.id
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

  if (loading) {
    return <CommentsShimmer />
  }

  return (
    <div>
      <Button
        className="mb-5 mt-2 w-full text-center"
        onClick={() => setShowSection(!showSection)}
        variant="outline"
        size="lg"
      >
        {showSection ? 'Hide more comments' : 'Show more comments'}
      </Button>
      {showSection ? (
        <>
          <div className="space-y-4">
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
