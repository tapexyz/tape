import type { Profile } from '@dragverse/lens'
import { LocalIDBStore } from '@dragverse/lens/custom-types'
import createIdbStorage from '@lib/createIdbStorage'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProfileState {
  activeProfile: Profile | null
  setActiveProfile: (currentProfile: Profile | null) => void
}

const useProfileStore = create(
  persist<ProfileState>(
    (set) => ({
      activeProfile: null,
      setActiveProfile: (activeProfile) => set({ activeProfile })
    }),
    {
      name: LocalIDBStore.PROFILE_STORE,
      storage: createIdbStorage()
    }
  )
)

export default useProfileStore

export const setActiveProfile = (profile: ProfileState['activeProfile']) =>
  useProfileStore.getState().setActiveProfile(profile)
