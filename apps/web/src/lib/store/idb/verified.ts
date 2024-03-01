import { LocalIDBStore } from '@dragverse/lens/custom-types'
import createIdbStorage from '@lib/createIdbStorage'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  verifiedProfiles: string[]
  setVerifiedProfiles: (verifiedProfiles: string[]) => void
}

const useVerifiedStore = create(
  persist<State>(
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
