import { LocalIDBStore } from '@dragverse/lens/custom-types'
import createIdbStorage from '@lib/createIdbStorage'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Token = {
  address: string
  decimals: number
  name: string
  symbol: string
}

interface State {
  allowedTokens: Token[]
  setAllowedTokens: (allowedTokens: Token[]) => void
}

const useAllowedTokensStore = create(
  persist<State>(
    (set) => ({
      allowedTokens: [],
      setAllowedTokens: (allowedTokens) => set({ allowedTokens })
    }),
    {
      name: LocalIDBStore.ALLOWED_TOKENS_STORE,
      storage: createIdbStorage()
    }
  )
)

export default useAllowedTokensStore
