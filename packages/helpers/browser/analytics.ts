import { IS_MAINNET, IS_PRODUCTION } from '@lenstube/constants/general'
import type { Dict } from 'mixpanel-browser'
import mixpanel from 'mixpanel-browser'

export const Analytics = {
  track: (eventName: string, payload?: Dict) => {
    if (IS_PRODUCTION && IS_MAINNET) {
      mixpanel.track(eventName, payload)
    }
  }
}

export const TRACK = {
  DISPATCHER: {
    TOGGLE: 'Toggle dispatcher'
  },
  PUBLICATION: {
    NEW_POST: 'New post',
    NEW_COMMENT: 'New comment',
    LIKE: 'Like publication',
    DISLIKE: 'Dislike publication',
    MIRROR: 'Mirror publication',
    PIN: 'Pin publication',
    DELETE: 'Delete publication',
    REPORT: 'Report Publication',
    TIP: {
      OPEN: 'Open Tip Modal',
      SENT: 'Tip Sent'
    },
    PERMALINK: 'Permalink publication',
    SHARE: {
      LENSTER: 'Share to Lenster',
      TWITTER: 'Share to Twitter',
      REDDIT: 'Share to Reddit',
      LINKEDIN: 'Share to LinkedIn'
    },
    COLLECT: 'Collect publication'
  },
  AUTH: {
    CONNECT_WALLET: 'Connect Wallet',
    SIGN_IN_WITH_LENS: 'Sign in with Lens',
    SIGN_OUT: 'Sign Out'
  },
  CHANNEL: {
    CLICK_CHANNEL_VIDEOS: 'Click Channel Videos',
    CLICK_CHANNEL_BYTES: 'Click Channel Bytes',
    CLICK_CHANNEL_COMMENTED: 'Click Channel Commented',
    CLICK_CHANNEL_MIRRORED: 'Click Channel Mirrored',
    CLICK_CHANNEL_NFTS: 'Click Channel NFTs',
    CLICK_OTHER_CHANNELS: 'Click Other Channels',
    CLICK_CHANNEL_STATS: 'Click Channel Stats',
    CLICK_CHANNEL_ABOUT: 'Click Channel About',
    CLICK_CHANNEL_COVER_LINKS: 'Click Channel Cover Links',
    SWITCH: 'Switch Channel',
    UPDATE: 'Update Channel',
    SUBSCRIBE: 'Subscribe Channel',
    JOIN: 'Join Channel',
    UNSUBSCRIBE: 'Unsubscribe Channel'
  },
  DEPOSIT_MATIC: 'Deposit Matic',
  FILTER_CATEGORIES: 'Filter Categories',
  PLAY_BYTE_VIDEO: 'Play Byte Video',
  EMBED_VIDEO: {
    OPEN: 'Open Embed',
    COPY: 'Copy Embed',
    LOADED: 'Embed Video Loaded',
    WATCH_ON_LENSTUBE: 'Watch on LensTube',
    CLICK_EMBED_TITLE: 'Click Embed Title',
    CLICK_EMBED_CHANNEL: 'Click Embed Channel'
  },
  PROFILE_INTERESTS: {
    ADD: 'Add Profile Interest',
    REMOVE: 'Remove Profile Interest',
    VIEW: 'View Profile Interests'
  },
  CLICK_VIEW_METADATA: 'Click View Metadata',
  CLICK_VIEW_TOKEN: 'Click View Token',
  CLICK_VIEW_PROOF: 'Click View Proof',
  NOTIFICATIONS: {
    SWITCH_NOTIFICATION_TAB: 'Switch notifications tab',
    CLICK_NOTIFICATIONS: 'Click Notifications'
  },
  CLICK_USER_MENU: 'Click User Menu',
  OPENED_MUTUAL_CHANNELS: 'Opened Mutual Channels',
  OPEN_COLLECT: 'Open Collect',
  SEARCH: 'Search',
  SYSTEM: {
    SELECT_LOCALE: 'Select locale',
    TOGGLE_THEME: 'Toggle Theme',
    MORE_MENU: {
      OPEN: 'Open More Menu',
      GITHUB: 'Click Github',
      DISCORD: 'Click Discord',
      THANKS: 'Click Thanks',
      ROADMAP: 'Click Roadmap',
      TERMS: 'Click Terms',
      PRIVACY: 'Click Privacy',
      STATUS: 'Click Status',
      TWITTER: 'Click Twitter'
    }
  },
  PAGE_VIEW: {
    HOME: 'Home Page',
    EXPLORE: 'Explore Page',
    CHANNEL: 'Channel Page',
    EXPLORE_TRENDING: 'Trending Page',
    EXPLORE_INTERESTING: 'Interesting Page',
    MOD: 'Mod Page',
    EXPLORE_POPULAR: 'Popular Page',
    THANKS: 'Thanks Page',
    UPLOAD: {
      DROPZONE: 'DropZone Page',
      STEPS: 'Upload Steps Page'
    },
    SETTINGS: 'Settings Page',
    WATCH: 'Watch Page',
    BYTES: 'Bytes Page',
    NOTIFICATIONS: 'Notifications Page'
  }
}
