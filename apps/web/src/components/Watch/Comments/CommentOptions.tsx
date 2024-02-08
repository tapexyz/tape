import ReportPublication from '@components/Report/Publication'
import Confirm from '@components/UIElements/Confirm'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import useProfileStore from '@lib/store/idb/profile'
import { SIGN_IN_REQUIRED } from '@tape.xyz/constants'
import { EVENTS, Tower } from '@tape.xyz/generic'
import type { Comment } from '@tape.xyz/lens'
import { useHidePublicationMutation } from '@tape.xyz/lens'
import {
  DropdownMenu,
  DropdownMenuItem,
  FlagOutline,
  Modal,
  ThreeDotsOutline,
  TrashOutline
} from '@tape.xyz/ui'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

type Props = {
  comment: Comment
}

const CommentOptions: FC<Props> = ({ comment }) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const handleWrongNetwork = useHandleWrongNetwork()

  const { activeProfile } = useProfileStore()

  const [hideComment, { loading: hiding }] = useHidePublicationMutation({
    update(cache) {
      const normalizedId = cache.identify({
        id: comment?.id,
        __typename: 'Comment'
      })
      cache.evict({ id: normalizedId })
      cache.gc()
    },
    onCompleted: () => {
      toast.success(`Comment deleted`)
      Tower.track(EVENTS.PUBLICATION.DELETE, {
        publication_type: comment.__typename?.toLowerCase()
      })
    }
  })

  const onHideComment = async () => {
    await hideComment({ variables: { request: { for: comment?.id } } })
    setShowConfirm(false)
  }

  const onClickReport = async () => {
    if (!activeProfile?.id) {
      return toast.error(SIGN_IN_REQUIRED)
    }
    await handleWrongNetwork()

    setShowReportModal(true)
  }

  return (
    <>
      <Confirm
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        action={onHideComment}
        loading={hiding}
      />
      <DropdownMenu trigger={<ThreeDotsOutline className="size-3.5" />}>
        <div className="w-36 overflow-hidden">
          <div className="flex flex-col rounded-lg text-sm transition duration-150 ease-in-out">
            {activeProfile?.id === comment?.by?.id && (
              <DropdownMenuItem onClick={() => setShowConfirm(true)}>
                <div className="flex items-center gap-2">
                  <TrashOutline className="size-3.5" />
                  <span className="whitespace-nowrap">Delete</span>
                </div>
              </DropdownMenuItem>
            )}

            <Modal
              title="Report"
              show={showReportModal}
              setShow={setShowReportModal}
            >
              <ReportPublication
                publication={comment}
                close={() => setShowReportModal(false)}
              />
            </Modal>
            <button
              className="!cursor-default rounded-md px-3 py-1.5 hover:bg-gray-500/20"
              onClick={() => onClickReport()}
            >
              <div className="flex items-center gap-2">
                <FlagOutline className="size-3.5" />
                <p className="whitespace-nowrap">Report</p>
              </div>
            </button>
          </div>
        </div>
      </DropdownMenu>
    </>
  )
}

export default CommentOptions
