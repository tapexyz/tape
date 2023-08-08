import { create } from 'zustand'

type DraftPublication = {
  title: string
  description: string
}
const defaults = {
  title: '',
  description: ''
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
