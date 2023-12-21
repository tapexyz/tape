import { CustomCommentsFilterEnum } from '@tape.xyz/lens/custom-types'
import { create } from 'zustand'

interface CommentState {
  selectedCommentFilter: CustomCommentsFilterEnum
  setSelectedCommentFilter: (filter: CustomCommentsFilterEnum) => void
}

const useCommentStore = create<CommentState>((set) => ({
  selectedCommentFilter: CustomCommentsFilterEnum.RELEVANT_COMMENTS,
  setSelectedCommentFilter: (selectedCommentFilter) =>
    set({ selectedCommentFilter })
}))

export default useCommentStore
