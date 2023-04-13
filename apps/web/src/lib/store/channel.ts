import type { Profile } from 'lens'
import { CustomCommentsFilterEnum, CustomNotificationsFilterEnum } from 'utils'
import { create } from 'zustand'

interface ChannelState {
  channels: Profile[]
  showCreateChannel: boolean
  hasNewNotification: boolean
  userSigNonce: number
  selectedChannel: Profile | null
  selectedCommentFilter: CustomCommentsFilterEnum
  selectedNotificationsFilter: CustomNotificationsFilterEnum
  setSelectedChannel: (channel: Profile | null) => void
  setUserSigNonce: (userSigNonce: number) => void
  setShowCreateChannel: (showCreateChannel: boolean) => void
  setChannels: (channels: Profile[]) => void
  setHasNewNotification: (value: boolean) => void
  setSelectedCommentFilter: (filter: CustomCommentsFilterEnum) => void
  setSelectedNotificationsFilter: (
    filter: CustomNotificationsFilterEnum
  ) => void
}

export const useChannelStore = create<ChannelState>((set) => ({
  channels: [],
  showCreateChannel: false,
  hasNewNotification: false,
  selectedChannel: null,
  userSigNonce: 0,
  selectedCommentFilter: CustomCommentsFilterEnum.RELEVANT_COMMENTS,
  setSelectedCommentFilter: (selectedCommentFilter) =>
    set({ selectedCommentFilter }),
  selectedNotificationsFilter: CustomNotificationsFilterEnum.HIGH_SIGNAL,
  setSelectedNotificationsFilter: (selectedNotificationsFilter) =>
    set({ selectedNotificationsFilter }),
  setSelectedChannel: (channel) => set({ selectedChannel: channel }),
  setUserSigNonce: (userSigNonce) => set({ userSigNonce }),
  setHasNewNotification: (b) => set({ hasNewNotification: b }),
  setChannels: (channels) => set({ channels }),
  setShowCreateChannel: (showCreateChannel) => set({ showCreateChannel })
}))

export default useChannelStore
