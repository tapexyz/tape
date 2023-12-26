import type { Profile } from '@tape.xyz/lens'

import createIdbStorage from '@lib/createIdbStorage'
import { LocalIDBStore } from '@tape.xyz/lens/custom-types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProfileState {
  activeProfile: null | Profile
  setActiveProfile: (currentProfile: null | Profile) => void
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
