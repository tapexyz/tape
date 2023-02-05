import CommentOutline from '@components/Common/Icons/CommentOutline'
import Modal from '@components/UIElements/Modal'
import VideoComments from '@components/Watch/VideoComments'
import type { Publication } from 'lens'
import type { FC } from 'react'
import React, { useState } from 'react'

type Props = {
  trigger: React.ReactNode
  video: Publication
}

const CommentModal: FC<Props> = ({ trigger, video }) => {
  const [show, setShow] = useState(false)

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
        panelClassName="max-w-lg ml-9"
        show={show}
        autoClose
        onClose={() => setShow(false)}
      >
        <div className="no-scrollbar max-h-[40vh] overflow-y-auto pt-5">
          <VideoComments video={video} hideTitle />
        </div>
      </Modal>
    </>
  )
}

export default CommentModal
