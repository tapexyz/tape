import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'

type Tokens = {
  accessToken: string | null
  refreshToken: string | null
}

interface AuthState {
  status: 'idle' | 'signOut' | 'signIn'
  accessToken: Tokens['accessToken']
  refreshToken: Tokens['refreshToken']
  signIn: (tokens: {
    accessToken: Tokens['accessToken']
    refreshToken: Tokens['refreshToken']
  }) => void
  signOut: () => void
  hydrateAuthTokens: () => Tokens
}

const ACCESS_TOKEN_STORAGE_KEY = '@lenstube/access-token'
const REFRESH_TOKEN_STORAGE_KEY = '@lenstube/refresh-token'

export const useAuth = create<AuthState>((set, get) => ({
  status: 'idle',
  accessToken: null,
  refreshToken: null,
  signIn: async ({ accessToken, refreshToken }) => {
    if (accessToken && refreshToken) {
      await AsyncStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken)
      await AsyncStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken)
    } else {
      await AsyncStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
      await AsyncStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
    }
    set(({ accessToken }) => ({
      status: 'signIn',
      accessToken
    }))
  },
  signOut: async () => {
    await AsyncStorage.removeItem('token')
    set({ status: 'signOut', accessToken: null })
  },
  hydrateAuthTokens: () => {
    return {
      accessToken: get().accessToken,
      refreshToken: get().refreshToken
    }
  }
}))

export const signOut = () => useAuth.getState().signOut()
export const signIn = (tokens: { accessToken: string; refreshToken: string }) =>
  useAuth.getState().signIn(tokens)
export const hydrateAuthTokens = () => useAuth.getState().hydrateAuthTokens()
