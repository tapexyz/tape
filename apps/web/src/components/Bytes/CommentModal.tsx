import CommentOutline from '@components/Common/Icons/CommentOutline'
import Modal from '@components/UIElements/Modal'
import NonRelevantComments from '@components/Watch/Comments/NonRelevantComments'
import VideoComments from '@components/Watch/Comments/VideoComments'
import type { Publication } from 'lens'
import { useHasNonRelevantCommentsQuery } from 'lens'
import type { FC } from 'react'
import React, { useState } from 'react'

type Props = {
  trigger: React.ReactNode
  video: Publication
}

const CommentModal: FC<Props> = ({ trigger, video }) => {
  const [show, setShow] = useState(false)

  const { data: noneRelevantComments } = useHasNonRelevantCommentsQuery({
    variables: { request: { commentsOf: video.id, limit: 1 } },
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
          {hasNonRelevantComments && <NonRelevantComments video={video} />}
        </div>
      </Modal>
    </>
  )
}

export default CommentModal
