import mixpanel, { Dict } from 'mixpanel-browser'

import { IS_MAINNET, MIXPANEL_TOKEN } from './constants'

export const TRACK = {
  DISPATCHER_ENABLED: 'Dispatcher Enabled',
  GET_VERIFIED: 'Get Verified',
  UPLOADED_VIDEO: 'Uploaded Video',
  UPDATED_CHANNEL_INFO: 'Updated Channel Info',
  COLLECT: {
    OPEN: 'Open Collect',
    FREE: 'Collected for Free',
    FEE: 'Collected for Fee'
  },
  COPY: { VIDEO_URL: 'Copy Video Url' },
  SHARE_VIDEO: {
    LENSTER: 'Share to Lenster',
    TWITTER: 'Share to Twitter',
    REDDIT: 'Share to Reddit',
    LINKEDIN: 'Share to LinkedIn'
  },
  SEARCH_CHANNELS: 'Search Channels',
  SEARCH_VIDEOS: 'Search Videos',
  SYSTEM: {
    THEME: {
      DARK: 'Seleted Dark Theme',
      LIGHT: 'Seleted Light Theme'
    },
    MORE_MENU: {
      OPEN: 'Open More Menu',
      GITHUB: 'Click Github',
      DISCORD: 'Click Discord',
      STATUS: 'Click Status',
      TWITTER: 'Click Twitter'
    }
  },
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
