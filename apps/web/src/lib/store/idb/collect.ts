import type { CollectModuleType } from '@dragverse/lens/custom-types'
import { LocalIDBStore } from '@dragverse/lens/custom-types'
import createIdbStorage from '@lib/createIdbStorage'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  collectModule: CollectModuleType | null
  setCollectModule: (collectModule: CollectModuleType | null) => void
  saveAsDefault: boolean
  setSaveAsDefault: (saveAsDefault: boolean) => void
}

const useCollectStore = create(
  persist<State>(
    (set) => ({
      collectModule: null,
      setCollectModule: (collectModule) => set({ collectModule }),
      saveAsDefault: true,
      setSaveAsDefault: (saveAsDefault) => set({ saveAsDefault })
    }),
    {
      name: LocalIDBStore.COLLECT_STORE,
      storage: createIdbStorage()
    }
  )
)

export default useCollectStore
