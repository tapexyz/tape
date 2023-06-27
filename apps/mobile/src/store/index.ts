import type { Profile } from '@lenstube/lens'
import { create } from 'zustand'

interface AuthPerisistState {
  homeGradientColor: string
  setHomeGradientColor: (homeGradientColor: string) => void
  channels: Profile[]
  setChannels: (channels: Profile[]) => void
  selectedChannel: Profile | null
  setSelectedChannel: (channel: Profile | null) => void
}

const useMobileStore = create<AuthPerisistState>((set) => ({
  homeGradientColor: '#000000',
  setHomeGradientColor: (homeGradientColor) => set({ homeGradientColor }),
  channels: [],
  setChannels: (channels) => set({ channels }),
  selectedChannel: null,
  setSelectedChannel: (channel) => set({ selectedChannel: channel })
}))

export default useMobileStore
