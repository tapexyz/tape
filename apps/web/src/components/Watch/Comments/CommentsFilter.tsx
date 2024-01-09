import useCommentStore from '@lib/store/comment'
import { CustomCommentsFilterEnum } from '@tape.xyz/lens/custom-types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  SortOutline
} from '@tape.xyz/ui'
import clsx from 'clsx'
import React from 'react'

const CommentsFilter = () => {
  const { selectedCommentFilter, setSelectedCommentFilter } = useCommentStore()

  return (
    <DropdownMenu trigger={<SortOutline className="size-5" />}>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="tape-border rounded-xl bg-white p-2 dark:bg-black"
      >
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CommentsFilter
