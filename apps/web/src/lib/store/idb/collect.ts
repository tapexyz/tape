import type { CollectModuleType } from '@tape.xyz/lens/custom-types'

import createIdbStorage from '@lib/createIdbStorage'
import { LocalIDBStore } from '@tape.xyz/lens/custom-types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  collectModule: CollectModuleType | null
  setCollectModule: (collectModule: CollectModuleType | null) => void
}

const useCollectStore = create(
  persist<State>(
    (set) => ({
      collectModule: null,
      setCollectModule: (collectModule) => set({ collectModule })
    }),
    {
      name: LocalIDBStore.COLLECT_STORE,
      storage: createIdbStorage()
    }
  )
)

export default useCollectStore
