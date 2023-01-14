import type { Publication } from 'lens'
import { create } from 'zustand'

interface EchoState {
  selectedTrack: Publication | null
  setSelectedTrack: (publication: Publication | null) => void
}

export const useEchoStore = create<EchoState>((set) => ({
  selectedTrack: null,
  setSelectedTrack: (selectedTrack) => set({ selectedTrack })
}))

export default useEchoStore
