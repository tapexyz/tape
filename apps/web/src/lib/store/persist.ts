import type { UploadedVideo } from 'utils'
import create from 'zustand'
import { persist } from 'zustand/middleware'

import { UPLOADED_VIDEO_FORM_DEFAULTS } from '.'

interface AppPerisistState {
  selectedChannelId: string | null
  sidebarCollapsed: boolean
  notificationCount: number
  uploadedVideo: UploadedVideo
  setUploadedVideo: (video: { [k: string]: any }) => void
  setNotificationCount: (count: number) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setSelectedChannelId: (id: string | null) => void
}

export const usePersistStore = create(
  persist<AppPerisistState>(
    (set) => ({
      selectedChannelId: null,
      sidebarCollapsed: true,
      notificationCount: 0,
      uploadedVideo: UPLOADED_VIDEO_FORM_DEFAULTS,

      setSidebarCollapsed: (sidebarCollapsed) =>
        set(() => ({ sidebarCollapsed })),
      setNotificationCount: (notificationCount) =>
        set(() => ({ notificationCount })),
      setSelectedChannelId: (id) => set(() => ({ selectedChannelId: id })),
      setUploadedVideo: (videoData) =>
        set((state) => ({
          uploadedVideo: { ...state.uploadedVideo, ...videoData }
        }))
    }),
    {
      name: 'lenstube.store'
    }
  )
)

export default usePersistStore
