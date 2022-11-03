import { useMutation } from '@apollo/client'
import DropMenu from '@components/UIElements/DropMenu'
import useAppStore from '@lib/store'
import { useRouter } from 'next/router'
import React, { Dispatch, FC } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineDelete } from 'react-icons/ai'
import { FiFlag } from 'react-icons/fi'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { HidePublicationDocument } from 'src/types/lens'
import { LenstubePublication } from 'src/types/local'

type Props = {
  setShowReport: Dispatch<boolean>
  comment: LenstubePublication
}

const CommentOptions: FC<Props> = ({ comment, setShowReport }) => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const router = useRouter()

  const [hideComment] = useMutation(HidePublicationDocument, {
    onCompleted() {
      toast.success('Comment deleted')
      router.reload()
    }
  })

  const onHideComment = () => {
    if (
      confirm(
        'This will hide your comment from lens, are you sure want to continue?\n\nNote: This cannot be reverted.'
      )
    ) {
      hideComment({ variables: { request: { publicationId: comment?.id } } })
    }
  }

  return (
    <DropMenu
      trigger={
        <div className="p-1">
          <HiOutlineDotsVertical />
        </div>
      }
    >
      <div className="p-1 mt-0.5 overflow-hidden border border-gray-200 rounded-lg shadow dark:border-gray-800 bg-secondary">
        <div className="flex flex-col text-sm transition duration-150 ease-in-out rounded-lg">
          {selectedChannel?.id === comment?.profile?.id && (
            <button
              type="button"
              onClick={() => onHideComment()}
              className="inline-flex items-center px-3 py-1.5 space-x-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
            >
              <AiOutlineDelete className="text-base" />
              <span className="whitespace-nowrap">Delete</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowReport(true)}
            className="inline-flex hover:text-red-500 items-center px-3 py-1.5 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <FiFlag className="text-sm ml-0.5" />
            <span className="whitespace-nowrap">Report</span>
          </button>
        </div>
      </div>
    </DropMenu>
  )
}

export default CommentOptions
