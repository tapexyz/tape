import SortOutline from '@components/Common/Icons/SortOutline'
import { CustomCommentsFilterEnum } from '@dragverse/lens/custom-types'
import useProfileStore from '@lib/store/profile'
import { Box, DropdownMenu, Text } from '@radix-ui/themes'

const CommentsFilter = () => {
  const { selectedCommentFilter, setSelectedCommentFilter } = useProfileStore()

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
