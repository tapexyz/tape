import { create } from 'zustand'

interface AuthPerisistState {
  homeGradientColor: string | null
  setHomeGradientColor: (homeGradientColor: string | null) => void
}

const useMobileStore = create<AuthPerisistState>((set) => ({
  homeGradientColor: null,
  setHomeGradientColor: (homeGradientColor) => set({ homeGradientColor })
}))

export default useMobileStore
