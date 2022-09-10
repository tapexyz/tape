import mixpanel, { Dict } from 'mixpanel-browser'

import { IS_MAINNET, MIXPANEL_TOKEN } from './constants'

export const TRACK = {
  DISPATCHER_ENABLED: 'Dispatcher Enabled',
  GET_VERIFIED: 'Get Verified',
  UPLOADED_VIDEO: 'Uploaded Video',
  CLICKED_BYTES_TAG_AT_UPLOAD: 'Clicked Bytes During Upload',
  CLICK_CHANNEL_SETTINGS: 'Clicked Channel Settings',
  UPDATE_CHANNEL_INFO: 'Clicked Channel Info',
  CHANGE_CHANNEL_COVER: 'Clicked Channel Cover',
  UPLOADED_BYTE_VIDEO: 'Uploaded Byte Video',
  UPLOADED_TO_IPFS: 'Uploaded to IPFS',
  UPLOADED_TO_ARWEAVE: 'Uploaded to Arweave',
  UPDATED_CHANNEL_INFO: 'Updated Channel Info',
  EMBED_VIDEO: {
    OPEN: 'Open Embed',
    COPY: 'Copy Embed'
  },
  OPENED_MUTUAL_CHANNELS: 'Opened Mutual Channels',
  COLLECT: {
    OPEN: 'Open Collect',
    FREE: 'Collected for Free',
    FEE: 'Collected for Fee'
  },
  TIP: {
    OPEN: 'Open Tip Modal',
    SENT: 'Sent Tip'
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
      ROADMAP: 'Click Roadmap',
      STATUS: 'Click Status',
      TWITTER: 'Click Twitter'
    }
  },
  PAGE_VIEW: {
    HOME: 'Home Page',
    EXPLORE: 'Explore Page',
    CHANNEL: 'Channel Page',
    EXPLORE_TRENDING: 'Trending Page',
    EXPLORE_RECENT: 'Recents Page',
    EXPLORE_CURATED: 'Curated Page',
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
