import type { Profile } from '@lenstube/lens'
import { PublicationSortCriteria } from '@lenstube/lens'
import { create } from 'zustand'

import { theme } from '~/helpers/theme'

import { useMobilePersistStore } from './persist'

type ExploreFilter = {
  criteria: PublicationSortCriteria
  category: string | null
}

interface AuthState {
  userSigNonce: number
  setUserSigNonce: (userSigNonce: number) => void
  homeGradientColor: string
  setHomeGradientColor: (homeGradientColor: string) => void
  channels: Profile[]
  setChannels: (channels: Profile[]) => void
  selectedChannel: Profile | null
  setSelectedChannel: (channel: Profile | null) => void
  selectedExploreFilter: ExploreFilter
  setSelectedExploreFilter: (filter: ExploreFilter) => void
}

export const getBgColor = () =>
  theme[useMobilePersistStore.getState().theme].backgroudColor

const useMobileStore = create<AuthState>((set) => ({
  homeGradientColor: getBgColor(),
  setHomeGradientColor: (homeGradientColor) => set({ homeGradientColor }),
  channels: [],
  setChannels: (channels) => set({ channels }),
  selectedChannel: null,
  setSelectedChannel: (channel) => set({ selectedChannel: channel }),
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
