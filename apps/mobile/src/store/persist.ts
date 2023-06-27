import AsynStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthPerisistState {
  selectedChannelId: string | null
  setSelectedChannelId: (id: string | null) => void
}

const useMobilePersistStore = create<AuthPerisistState>(
  // @ts-expect-error zustand
  persist<AuthPerisistState>(
    (set) => ({
      selectedChannelId: null,
      setSelectedChannelId: (id) => set({ selectedChannelId: id })
    }),
    {
      name: '@lenstube/store',
      getStorage: () => AsynStorage
    }
  )
)

export default useMobilePersistStore
