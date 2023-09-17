import type { Profile } from '@lenstube/lens'
import { CustomCommentsFilterEnum } from '@lenstube/lens/custom-types'
import { create } from 'zustand'

interface ChannelState {
  showCreateChannel: boolean
  hasNewNotification: boolean
  userSigNonce: number
  activeChannel: Profile | null
  selectedCommentFilter: CustomCommentsFilterEnum
  setActiveChannel: (channel: Profile | null) => void
  setUserSigNonce: (userSigNonce: number) => void
  setShowCreateChannel: (showCreateChannel: boolean) => void
  setHasNewNotification: (value: boolean) => void
  setSelectedCommentFilter: (filter: CustomCommentsFilterEnum) => void
}

export const useChannelStore = create<ChannelState>((set) => ({
  showCreateChannel: false,
  hasNewNotification: false,
  activeChannel: null,
  userSigNonce: 0,
  selectedCommentFilter: CustomCommentsFilterEnum.RELEVANT_COMMENTS,
  setSelectedCommentFilter: (selectedCommentFilter) =>
    set({ selectedCommentFilter }),
  setActiveChannel: (activeChannel) => set({ activeChannel }),
  setUserSigNonce: (userSigNonce) => set({ userSigNonce }),
  setHasNewNotification: (b) => set({ hasNewNotification: b }),
  setShowCreateChannel: (showCreateChannel) => set({ showCreateChannel })
}))

export default useChannelStore
