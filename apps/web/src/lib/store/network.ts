import { create } from 'zustand'

interface State {
  showSwitchNetwork: boolean
  setShowSwitchNetwork: (value: boolean) => void
}

export const useNetworkStore = create<State>((set) => ({
  showSwitchNetwork: false,
  setShowSwitchNetwork: (showSwitchNetwork) => set({ showSwitchNetwork })
}))

export default useNetworkStore
