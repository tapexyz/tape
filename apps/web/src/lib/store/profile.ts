import type { Profile } from '@tape.xyz/lens'
import { CustomCommentsFilterEnum } from '@tape.xyz/lens/custom-types'
import { create } from 'zustand'

interface ProfileState {
  hasNewNotification: boolean
  userSigNonce: number
  activeProfile: Profile | null
  selectedCommentFilter: CustomCommentsFilterEnum
  setActiveProfile: (profile: Profile | null) => void
  setUserSigNonce: (userSigNonce: number) => void
  setHasNewNotification: (value: boolean) => void
  setSelectedCommentFilter: (filter: CustomCommentsFilterEnum) => void
}

export const useProfileStore = create<ProfileState>((set) => ({
  hasNewNotification: false,
  activeProfile: null,
  userSigNonce: 0,
  selectedCommentFilter: CustomCommentsFilterEnum.RELEVANT_COMMENTS,
  setSelectedCommentFilter: (selectedCommentFilter) =>
    set({ selectedCommentFilter }),
  setActiveProfile: (activeProfile) => set({ activeProfile }),
  setUserSigNonce: (userSigNonce) => set({ userSigNonce }),
  setHasNewNotification: (hasNewNotification) => set({ hasNewNotification })
}))

export default useProfileStore
