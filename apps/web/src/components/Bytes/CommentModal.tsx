import CommentOutline from '@components/Common/Icons/CommentOutline'
import Modal from '@components/UIElements/Modal'
import NonRelevantComments from '@components/Watch/Comments/NonRelevantComments'
import VideoComments from '@components/Watch/Comments/VideoComments'
import useAppStore from '@lib/store'
import type { Publication } from 'lens'
import {
  CommentRankingFilter,
  PublicationMainFocus,
  useHasNonRelevantCommentsQuery
} from 'lens'
import type { FC } from 'react'
import React, { useState } from 'react'
import { CustomCommentsFilterEnum, LENS_CUSTOM_FILTERS } from 'utils'

type Props = {
  trigger: React.ReactNode
  video: Publication
}

const CommentModal: FC<Props> = ({ trigger, video }) => {
  const [show, setShow] = useState(false)
  const selectedCommentFilter = useAppStore(
    (state) => state.selectedCommentFilter
  )

  const request = {
    limit: 1,
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
    commentsRankingFilter: CommentRankingFilter.NoneRelevant
  }

  const { data: noneRelevantComments } = useHasNonRelevantCommentsQuery({
    variables: { request },
    fetchPolicy: 'no-cache',
    skip: !video.id
  })
  const hasNonRelevantComments = Boolean(
    noneRelevantComments?.publications?.items.length
  )

  return (
    <>
      <button
        type="button"
        className="focus:outline-none"
        onClick={() => setShow(true)}
      >
        {trigger}
      </button>
      <Modal
        title={
          <span className="flex items-center space-x-2 text-lg">
            <CommentOutline className="h-4 w-4" />
            <span className="font-semibold">Comments</span>
          </span>
        }
        panelClassName="max-w-lg lg:ml-9"
        show={show}
        onClose={() => setShow(false)}
      >
        <div className="no-scrollbar max-h-[40vh] overflow-y-auto pt-3">
          <VideoComments video={video} hideTitle />
          {hasNonRelevantComments &&
          selectedCommentFilter ===
            CustomCommentsFilterEnum.RELEVANT_COMMENTS ? (
            <NonRelevantComments video={video} className="pt-4" />
          ) : null}
        </div>
      </Modal>
    </>
  )
}

export default CommentModal
