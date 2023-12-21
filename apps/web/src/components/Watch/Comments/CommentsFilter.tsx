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
          <SortOutline className="h-5 w-5" />
        </Box>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" variant="soft" sideOffset={10}>
        <DropdownMenu.Item
          onClick={() =>
            setSelectedCommentFilter(CustomCommentsFilterEnum.RELEVANT_COMMENTS)
          }
        >
          <Text
            weight={
              selectedCommentFilter ===
              CustomCommentsFilterEnum.RELEVANT_COMMENTS
                ? 'bold'
                : 'regular'
            }
            className="whitespace-nowrap"
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
            weight={
              selectedCommentFilter === CustomCommentsFilterEnum.NEWEST_COMMENTS
                ? 'bold'
                : 'regular'
            }
            className="whitespace-nowrap"
          >
            Newest first
          </Text>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default CommentsFilter
