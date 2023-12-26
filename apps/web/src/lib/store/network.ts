import { create } from 'zustand'

interface State {
  setShowSwitchNetwork: (value: boolean) => void
  showSwitchNetwork: boolean
}

const useNetworkStore = create<State>((set) => ({
  setShowSwitchNetwork: (showSwitchNetwork) => set({ showSwitchNetwork }),
  showSwitchNetwork: false
}))

export default useNetworkStore
