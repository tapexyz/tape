import mixpanel, { Dict } from 'mixpanel-browser'

import { IS_MAINNET, MIXPANEL_TOKEN } from './constants'

export const TRACK = {
  PAGE_VIEW: {
    HOME: 'Home Page',
    EXPLORE: 'Explore Page',
    CHANNEL: 'Channel Page',
    EXPLORE_TRENDING: 'Trending Page',
    EXPLORE_RARE: 'Looks Rare Page',
    EXPLORE_RECENT: 'Recents Page',
    PRIVACY: 'Privacy Page',
    REPORT: 'Report Page',
    UPLOAD: {
      DROPZONE: 'DropZone Page',
      STEPS: 'Upload Steps Page'
    },
    SETTINGS: 'Settings Page',
    WATCH: 'Watch Page',
    BYTES: 'Bytes Page',
    NOTIFICATIONS: 'Notifications Page',
    LIBRARY: 'Library Page'
  }
}

export const Mixpanel = {
  track: (eventName: string, payload?: Dict) => {
    if (MIXPANEL_TOKEN && IS_MAINNET) {
      mixpanel.track(eventName, payload)
    }
  }
}
