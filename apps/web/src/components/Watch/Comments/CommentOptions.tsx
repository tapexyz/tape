import FlagOutline from '@components/Common/Icons/FlagOutline'
import ThreeDotsOutline from '@components/Common/Icons/ThreeDotsOutline'
import TrashOutline from '@components/Common/Icons/TrashOutline'
import ReportPublication from '@components/ReportPublication'
import Confirm from '@components/UIElements/Confirm'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import useAuthPersistStore from '@lib/store/auth'
import { t, Trans } from '@lingui/macro'
import { Box, Dialog, DropdownMenu, Flex, Text } from '@radix-ui/themes'
import { Analytics, TRACK } from '@tape.xyz/browser'
import type { Comment } from '@tape.xyz/lens'
import { useHidePublicationMutation } from '@tape.xyz/lens'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

type Props = {
  comment: Comment
}

const CommentOptions: FC<Props> = ({ comment }) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const handleWrongNetwork = useHandleWrongNetwork()

  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

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
      toast.success(t`Comment deleted`)
      Analytics.track(TRACK.PUBLICATION.DELETE, {
        publication_type: comment.__typename?.toLowerCase()
      })
    }
  })

  const onHideComment = () => {
    hideComment({ variables: { request: { for: comment?.id } } })
  }

  const onClickReport = () => {
    if (!selectedSimpleProfile?.id) {
      return toast.error('Sign in to proceed')
    }
    if (handleWrongNetwork()) {
      return
    }
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
            <ThreeDotsOutline className="h-3.5 w-3.5" />
          </Box>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content sideOffset={10} variant="soft" align="end">
          <div className="w-36 overflow-hidden">
            <div className="flex flex-col rounded-lg text-sm transition duration-150 ease-in-out">
              {selectedSimpleProfile?.id === comment?.by?.id && (
                <DropdownMenu.Item
                  onClick={() => setShowConfirm(true)}
                  color="red"
                >
                  <Flex align="center" gap="2">
                    <TrashOutline className="h-3.5 w-3.5" />
                    <span className="whitespace-nowrap">
                      <Trans>Delete</Trans>
                    </span>
                  </Flex>
                </DropdownMenu.Item>
              )}

              <Dialog.Root>
                <Dialog.Trigger>
                  <button
                    className="cursor-default rounded px-3 py-1.5 hover:bg-gray-500/20"
                    onClick={() => onClickReport()}
                  >
                    <Flex align="center" gap="2">
                      <FlagOutline className="h-3.5 w-3.5" />
                      <Text size="2" className="whitespace-nowrap">
                        <Trans>Report</Trans>
                      </Text>
                    </Flex>
                  </button>
                </Dialog.Trigger>

                <Dialog.Content style={{ maxWidth: 450 }}>
                  <Dialog.Title>Report</Dialog.Title>

                  <ReportPublication publication={comment} />
                </Dialog.Content>
              </Dialog.Root>
            </div>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  )
}

export default CommentOptions
