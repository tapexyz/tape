import useCommentStore from '@lib/store/comment'
import { CustomCommentsFilterEnum } from '@tape.xyz/lens/custom-types'
import { DropdownMenu, DropdownMenuItem, SortOutline } from '@tape.xyz/ui'
import clsx from 'clsx'
import React from 'react'

const CommentsFilter = () => {
  const { selectedCommentFilter, setSelectedCommentFilter } = useCommentStore()

  return (
    <DropdownMenu trigger={<SortOutline className="size-5" />}>
      <DropdownMenuItem
        onClick={() =>
          setSelectedCommentFilter(CustomCommentsFilterEnum.RELEVANT_COMMENTS)
        }
      >
        <p
          className={clsx(
            'whitespace-nowrap',
            selectedCommentFilter ===
              CustomCommentsFilterEnum.RELEVANT_COMMENTS && 'font-bold'
          )}
        >
          Relevant
        </p>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() =>
          setSelectedCommentFilter(CustomCommentsFilterEnum.NEWEST_COMMENTS)
        }
      >
        <p
          className={clsx(
            'whitespace-nowrap',
            selectedCommentFilter ===
              CustomCommentsFilterEnum.NEWEST_COMMENTS && 'font-bold'
          )}
        >
          Newest first
        </p>
      </DropdownMenuItem>
    </DropdownMenu>
  )
}

export default CommentsFilter
