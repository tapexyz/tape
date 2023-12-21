import type { Profile } from '@tape.xyz/lens'
import { CustomCommentsFilterEnum } from '@tape.xyz/lens/custom-types'
import { create } from 'zustand'

interface ProfileState {
  hasNewNotification: boolean
  activeProfile: Profile | null
  selectedCommentFilter: CustomCommentsFilterEnum
  setActiveProfile: (profile: Profile | null) => void
  setHasNewNotification: (value: boolean) => void
  setSelectedCommentFilter: (filter: CustomCommentsFilterEnum) => void
}

export const useProfileStore = create<ProfileState>((set) => ({
  hasNewNotification: false,
  activeProfile: null,
  selectedCommentFilter: CustomCommentsFilterEnum.RELEVANT_COMMENTS,
  setSelectedCommentFilter: (selectedCommentFilter) =>
    set({ selectedCommentFilter }),
  setActiveProfile: (activeProfile) => set({ activeProfile }),
  setHasNewNotification: (hasNewNotification) => set({ hasNewNotification })
}))

export const setActiveProfile = (profile: ProfileState['activeProfile']) =>
  useProfileStore.getState().setActiveProfile(profile)

export default useProfileStore
