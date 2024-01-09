import ReportPublication from '@components/Report/Publication'
import Confirm from '@components/UIElements/Confirm'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import useProfileStore from '@lib/store/idb/profile'
import { Box, DropdownMenu, Flex, Text } from '@radix-ui/themes'
import { SIGN_IN_REQUIRED } from '@tape.xyz/constants'
import { EVENTS, Tower } from '@tape.xyz/generic'
import type { Comment } from '@tape.xyz/lens'
import { useHidePublicationMutation } from '@tape.xyz/lens'
import {
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

  const [hideComment] = useHidePublicationMutation({
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

  const onClickReport = () => {
    if (!activeProfile?.id) {
      return toast.error(SIGN_IN_REQUIRED)
    }
    if (handleWrongNetwork()) {
      return
    }
    setShowReportModal(true)
  }

  return (
    <>
      <Confirm
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        action={onHideComment}
      />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Box>
            <ThreeDotsOutline className="size-3.5" />
          </Box>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content sideOffset={10} variant="soft" align="end">
          <div className="w-36 overflow-hidden">
            <div className="flex flex-col rounded-lg text-sm transition duration-150 ease-in-out">
              {activeProfile?.id === comment?.by?.id && (
                <DropdownMenu.Item
                  onClick={() => setShowConfirm(true)}
                  color="red"
                >
                  <Flex align="center" gap="2">
                    <TrashOutline className="size-3.5" />
                    <span className="whitespace-nowrap">Delete</span>
                  </Flex>
                </DropdownMenu.Item>
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
                <Flex align="center" gap="2">
                  <FlagOutline className="size-3.5" />
                  <Text size="2" className="whitespace-nowrap">
                    Report
                  </Text>
                </Flex>
              </button>
            </div>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  )
}

export default CommentOptions
