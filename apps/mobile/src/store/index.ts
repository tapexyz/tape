import type { Profile } from '@lenstube/lens'
import { PublicationSortCriteria } from '@lenstube/lens'
import { create } from 'zustand'

type ExploreFilter = {
  criteria: PublicationSortCriteria
  category: string | null
}

interface AuthPerisistState {
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

const useMobileStore = create<AuthPerisistState>((set) => ({
  homeGradientColor: '#000000',
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
