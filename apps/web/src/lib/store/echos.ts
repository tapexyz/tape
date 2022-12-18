import type { LenstubePublication } from 'utils'
import create from 'zustand'

interface EchoState {
  selectedTrack: LenstubePublication | null
  setSelectedTrack: (publication: LenstubePublication | null) => void
}

export const useEchoStore = create<EchoState>((set) => ({
  selectedTrack: null,
  setSelectedTrack: (selectedTrack) => set(() => ({ selectedTrack }))
}))

export default useEchoStore
