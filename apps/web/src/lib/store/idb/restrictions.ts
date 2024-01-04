import createIdbStorage from '@lib/createIdbStorage'
import { LocalIDBStore } from '@tape.xyz/lens/custom-types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Restrictions = {
  suspended: boolean
  limited: boolean
  flagged: boolean
}

interface State {
  profileRestrictions: Restrictions
  setProfileRestrictions: (profileRestrictions: Restrictions) => void
}

const useProfileRestrictionsStore = create(
  persist<State>(
    (set) => ({
      profileRestrictions: { suspended: false, limited: false, flagged: false },
      setProfileRestrictions: (profileRestrictions) =>
        set({ profileRestrictions })
    }),
    {
      name: LocalIDBStore.RESTRICTIONS_STORE,
      storage: createIdbStorage()
    }
  )
)

export default useProfileRestrictionsStore
