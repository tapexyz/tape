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
  isSignedIn: boolean
  signIn: (tokens: { accessToken: string; refreshToken: string }) => void
  signOut: () => void
  hydrateAuthTokens: () => Tokens
}

const ACCESS_TOKEN_STORAGE_KEY = '@pripe/access-token'
const REFRESH_TOKEN_STORAGE_KEY = '@pripe/refresh-token'

export const useAuth = create<AuthState>((set, get) => ({
  status: 'idle',
  accessToken: null,
  refreshToken: null,
  isSignedIn: false,
  signIn: async ({ accessToken, refreshToken }) => {
    await AsyncStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken)
    await AsyncStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken)
    set(({ accessToken }) => ({
      status: 'signIn',
      accessToken,
      isSignedIn: true
    }))
  },
  signOut: async () => {
    await AsyncStorage.removeItem('token')
    set({ status: 'signOut', accessToken: null, isSignedIn: false })
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
export const isSignedIn = () => useAuth.getState().isSignedIn
