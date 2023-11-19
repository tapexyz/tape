import type { AlgoType } from '@dragverse/lens/custom-types'
import { TimelineFeedType } from '@dragverse/lens/custom-types'
import { create } from 'zustand'

interface HomeFeedState {
  selectedFeedType: TimelineFeedType
  setSelectedFeedType: (feedType: TimelineFeedType) => void
  selectedAlgoType: AlgoType | null
  setSelectedAlgoType: (algoType: AlgoType) => void
}

const useMobileHomeFeedStore = create<HomeFeedState>((set) => ({
  selectedFeedType: TimelineFeedType.CURATED,
  setSelectedFeedType: (selectedFeedType) => set({ selectedFeedType }),
  selectedAlgoType: null,
  setSelectedAlgoType: (selectedAlgoType) => set({ selectedAlgoType })
}))

export default useMobileHomeFeedStore
