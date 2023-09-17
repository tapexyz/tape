import { PublicationSortCriteria } from '@lenstube/lens'
import { create } from 'zustand'

import { colors } from '~/helpers/theme'

type ExploreFilter = {
  criteria: PublicationSortCriteria
  category: string | null
}

interface AuthState {
  userSigNonce: number
  setUserSigNonce: (userSigNonce: number) => void
  homeGradientColor: string
  setHomeGradientColor: (homeGradientColor: string) => void
  selectedExploreFilter: ExploreFilter
  setSelectedExploreFilter: (filter: ExploreFilter) => void
}

const useMobileStore = create<AuthState>((set) => ({
  homeGradientColor: colors.black,
  setHomeGradientColor: (homeGradientColor) => set({ homeGradientColor }),
  userSigNonce: 0,
  setUserSigNonce: (userSigNonce) => set({ userSigNonce }),
  selectedExploreFilter: {
    criteria: PublicationSortCriteria.TopCollected,
    category: null
  },
  setSelectedExploreFilter: (selectedExploreFilter) =>
    set({ selectedExploreFilter })
}))

export default useMobileStore
