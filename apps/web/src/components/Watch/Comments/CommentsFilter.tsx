import SortOutline from '@components/Common/Icons/SortOutline'
import Tooltip from '@components/UIElements/Tooltip'
import useProfileStore from '@lib/store/profile'
import { DropdownMenu } from '@radix-ui/themes'
import { CustomCommentsFilterEnum } from '@tape.xyz/lens/custom-types'
import React from 'react'

const CommentsFilter = () => {
  const setSelectedCommentFilter = useProfileStore(
    (state) => state.setSelectedCommentFilter
  )

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Tooltip content="Sort by" placement="top">
          <span>
            <SortOutline className="h-5 w-5" />
          </span>
        </Tooltip>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item
          onClick={() =>
            setSelectedCommentFilter(CustomCommentsFilterEnum.RELEVANT_COMMENTS)
          }
        >
          <span className="whitespace-nowrap">Relevant</span>
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onClick={() =>
            setSelectedCommentFilter(CustomCommentsFilterEnum.NEWEST_COMMENTS)
          }
        >
          <span className="whitespace-nowrap">Newest first</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default CommentsFilter
