import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Tokens = {
  accessToken: string | null
  refreshToken: string | null
}

interface AuthPerisistState {
  accessToken: Tokens['accessToken']
  refreshToken: Tokens['refreshToken']
  selectedChannelId: string | null
  setSelectedChannelId: (id: string | null) => void
  signIn: (tokens: { accessToken: string; refreshToken: string }) => void
  signOut: () => void
  hydrateAuthTokens: () => Tokens
}

export const useAuthPersistStore = create(
  persist<AuthPerisistState>(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      selectedChannelId: null,
      setSelectedChannelId: (id) => set({ selectedChannelId: id }),
      signIn: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),
      signOut: () => localStorage.removeItem('lenstube.store'),
      hydrateAuthTokens: () => {
        return {
          accessToken: get().accessToken,
          refreshToken: get().refreshToken
        }
      }
    }),
    {
      name: 'lenstube.store'
    }
  )
)

export default useAuthPersistStore

export const signIn = (tokens: { accessToken: string; refreshToken: string }) =>
  useAuthPersistStore.getState().signIn(tokens)
export const signOut = () => useAuthPersistStore.getState().signOut()
export const hydrateAuthTokens = () =>
  useAuthPersistStore.getState().hydrateAuthTokens()
