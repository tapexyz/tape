import createIdbStorage from '@lib/createIdbStorage'
import { LocalIDBStore } from '@tape.xyz/lens/custom-types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProfileState {
  verifiedProfiles: string[]
  setVerifiedProfiles: (verifiedProfiles: string[]) => void
}

const useVerifiedStore = create(
  persist<ProfileState>(
    (set) => ({
      verifiedProfiles: [],
      setVerifiedProfiles: (verifiedProfiles) => set({ verifiedProfiles })
    }),
    {
      name: LocalIDBStore.VERIFIED_STORE,
      storage: createIdbStorage()
    }
  )
)

export default useVerifiedStore
