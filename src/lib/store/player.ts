/* eslint-disable no-unused-vars */
import { VideoRefOnly } from '@components/UIElements/Player/Video'
import { LenstubePublication } from 'src/types/local'
import create from 'zustand'

interface PlayerState {
  playing: boolean
  muted: boolean
  upNextVideo: LenstubePublication | null
  setPlaying: (playing: boolean) => void
  setMuted: (muted: boolean) => void
  setUpNextVideo: (upNextVideo: LenstubePublication) => void
  togglePlay: ({ videoRef }: VideoRefOnly) => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
  playing: false,
  muted: false,
  setMuted: (muted) => set(() => ({ muted })),
  setPlaying: (playing) => set(() => ({ playing })),
  upNextVideo: null,
  setUpNextVideo: (upNextVideo) => set(() => ({ upNextVideo })),
  togglePlay: ({ videoRef }) => {
    if (videoRef.current?.paused) {
      videoRef.current?.play()
      set({ playing: true })
      return
    }
    set({ playing: false })
    videoRef.current?.pause()
  }
}))

export default usePlayerStore
