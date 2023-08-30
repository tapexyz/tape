import { PublicationMainFocus } from '@lenstube/lens'
import type { DocumentPickerResult } from 'expo-document-picker'
import type { ImagePickerResult } from 'expo-image-picker'
import { create } from 'zustand'

type DraftPublication = {
  title: string
  description: string
  mainFocus: PublicationMainFocus
  asset: ImagePickerResult | DocumentPickerResult | null
  poster: string
  attachmentEnabled: boolean
  collectEnabled: boolean
  referenceEnabled: boolean
}

const defaults = {
  title: '',
  description: '',
  mainFocus: PublicationMainFocus.TextOnly,
  asset: null,
  poster: '',
  attachmentEnabled: false,
  collectEnabled: false,
  referenceEnabled: false
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
