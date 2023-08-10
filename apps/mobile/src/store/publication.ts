import { PublicationMainFocus } from '@lenstube/lens'
import type * as MediaLibrary from 'expo-media-library'
import { create } from 'zustand'

type DraftPublication = {
  title: string
  description: string
  mainFocus: PublicationMainFocus
  asset: MediaLibrary.AssetInfo | null
  poster: string
  attachmentEnabled: boolean
  collectEnabled: boolean
}

const defaults = {
  title: '',
  description: '',
  mainFocus: PublicationMainFocus.TextOnly,
  asset: null,
  poster: '',
  attachmentEnabled: false,
  collectEnabled: false
}

interface State {
  draftedPublication: DraftPublication
  setDraftedPublication: (draft: DraftPublication) => void
}

const useMobilePublicationStore = create<State>((set) => ({
  draftedPublication: defaults,
  setDraftedPublication: (draftedPublication) => set({ draftedPublication })
}))

export default useMobilePublicationStore
