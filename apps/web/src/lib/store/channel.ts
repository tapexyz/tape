import type { Profile } from '@tape.xyz/lens'
import { CustomCommentsFilterEnum } from '@tape.xyz/lens/custom-types'
import { create } from 'zustand'

interface ChannelState {
  hasNewNotification: boolean
  userSigNonce: number
  activeChannel: Profile | null
  selectedCommentFilter: CustomCommentsFilterEnum
  setActiveChannel: (channel: Profile | null) => void
  setUserSigNonce: (userSigNonce: number) => void
  setHasNewNotification: (value: boolean) => void
  setSelectedCommentFilter: (filter: CustomCommentsFilterEnum) => void
}

export const useChannelStore = create<ChannelState>((set) => ({
  hasNewNotification: false,
  activeChannel: null,
  userSigNonce: 0,
  selectedCommentFilter: CustomCommentsFilterEnum.RELEVANT_COMMENTS,
  setSelectedCommentFilter: (selectedCommentFilter) =>
    set({ selectedCommentFilter }),
  setActiveChannel: (activeChannel) => set({ activeChannel }),
  setUserSigNonce: (userSigNonce) => set({ userSigNonce }),
  setHasNewNotification: (b) => set({ hasNewNotification: b })
}))

export default useChannelStore
