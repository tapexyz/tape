import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppPerisistState {
  accessToken: string | null
  refreshToken: string | null
  storeTokens: (tokens: {
    accessToken: string | null
    refreshToken: string | null
  }) => void
}

export const usePersistStore = create(
  persist<AppPerisistState>(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      storeTokens: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken })
    }),
    {
      name: 'lenstube.store'
    }
  )
)

export default usePersistStore
