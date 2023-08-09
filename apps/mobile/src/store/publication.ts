import { PublicationMainFocus } from '@lenstube/lens'
import { create } from 'zustand'

type DraftPublication = {
  title: string
  description: string
  mainFocus: PublicationMainFocus
}
const defaults = {
  title: '',
  description: '',
  mainFocus: PublicationMainFocus.TextOnly
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
