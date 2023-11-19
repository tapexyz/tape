import { LocalStore } from '@dragverse/lens/custom-types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Tokens = {
  accessToken: string | null
  refreshToken: string | null
}

interface AuthPerisistState {
  accessToken: Tokens['accessToken']
  refreshToken: Tokens['refreshToken']
  signIn: (tokens: { accessToken: string; refreshToken: string }) => void
  signOut: () => void
  hydrateAuthTokens: () => Tokens
}

export const useAuthPersistStore = create(
  persist<AuthPerisistState>(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      signIn: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),
      signOut: () => {
        localStorage.removeItem(LocalStore.TAPE_STORE)
        localStorage.removeItem(LocalStore.TAPE_AUTH_STORE)
        set({ accessToken: null, refreshToken: null })
      },
      hydrateAuthTokens: () => {
        return {
          accessToken: get().accessToken,
          refreshToken: get().refreshToken
        }
      }
    }),
    {
      name: LocalStore.TAPE_AUTH_STORE
    }
  )
)

export default useAuthPersistStore

export const signIn = (tokens: { accessToken: string; refreshToken: string }) =>
  useAuthPersistStore.getState().signIn(tokens)
export const signOut = () => useAuthPersistStore.getState().signOut()
export const hydrateAuthTokens = () =>
  useAuthPersistStore.getState().hydrateAuthTokens()
