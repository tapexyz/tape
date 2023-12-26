import SortOutline from '@components/Common/Icons/SortOutline'
import useCommentStore from '@lib/store/comment'
import { Box, DropdownMenu, Text } from '@radix-ui/themes'
import { CustomCommentsFilterEnum } from '@tape.xyz/lens/custom-types'
import React from 'react'

const CommentsFilter = () => {
  const { selectedCommentFilter, setSelectedCommentFilter } = useCommentStore()

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Box>
          <SortOutline className="size-5" />
        </Box>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" sideOffset={10} variant="soft">
        <DropdownMenu.Item
          onClick={() =>
            setSelectedCommentFilter(CustomCommentsFilterEnum.RELEVANT_COMMENTS)
          }
        >
          <Text
            className="whitespace-nowrap"
            weight={
              selectedCommentFilter ===
              CustomCommentsFilterEnum.RELEVANT_COMMENTS
                ? 'bold'
                : 'regular'
            }
          >
            Relevant
          </Text>
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onClick={() =>
            setSelectedCommentFilter(CustomCommentsFilterEnum.NEWEST_COMMENTS)
          }
        >
          <Text
            className="whitespace-nowrap"
            weight={
              selectedCommentFilter === CustomCommentsFilterEnum.NEWEST_COMMENTS
                ? 'bold'
                : 'regular'
            }
          >
            Newest first
          </Text>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default CommentsFilter
