import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { theme } from '~/helpers/theme'

type Tokens = {
  accessToken: string | null
  refreshToken: string | null
}
type MobileTheme = keyof typeof theme

interface AuthPerisistState {
  accessToken: Tokens['accessToken']
  refreshToken: Tokens['refreshToken']
  signIn: (tokens: {
    accessToken: Tokens['accessToken']
    refreshToken: Tokens['refreshToken']
  }) => void
  signOut: () => void
  hydrateAuthTokens: () => Tokens
  selectedChannelId: string | null
  setSelectedChannelId: (id: string | null) => void
  theme: MobileTheme
  setTheme: (theme: MobileTheme) => void
}

export const useMobilePersistStore = create(
  persist<AuthPerisistState>(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      signIn: ({ accessToken, refreshToken }) =>
        set({
          accessToken,
          refreshToken
        }),
      signOut: () => {
        set({ accessToken: null, refreshToken: null, selectedChannelId: null })
        AsyncStorage.clear()
      },
      hydrateAuthTokens: () => {
        return {
          accessToken: get().accessToken,
          refreshToken: get().refreshToken
        }
      },
      selectedChannelId: null,
      setSelectedChannelId: (id) => set({ selectedChannelId: id }),
      // theme state
      theme: 'dark',
      setTheme: (theme) => set({ theme })
    }),
    {
      name: '@pripe/mobile/store',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
)

export const signOut = () => useMobilePersistStore.getState().signOut()
export const signIn = (tokens: { accessToken: string; refreshToken: string }) =>
  useMobilePersistStore.getState().signIn(tokens)
export const hydrateAuthTokens = () =>
  useMobilePersistStore.getState().hydrateAuthTokens()
export const isLightMode = () =>
  useMobilePersistStore.getState().theme === 'light'
