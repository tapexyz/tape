import type { Dict } from 'mixpanel-browser'
import mixpanel from 'mixpanel-browser'
import { IS_MAINNET, MIXPANEL_TOKEN } from 'utils/constants'

export const Analytics = {
  track: (eventName: string, payload?: Dict) => {
    if (MIXPANEL_TOKEN && IS_MAINNET) {
      mixpanel.track(eventName, payload)
    }
  }
}

export const TRACK = {
  DISPATCHER_ENABLED: 'Dispatcher Enabled',
  GET_VERIFIED: 'Get Verified',
  UPLOADED_VIDEO: 'Uploaded Video',
  CLICKED_BYTES_TAG_AT_UPLOAD: 'Clicked Bytes During Upload',
  CLICK_CHANNEL_SETTINGS: 'Clicked Channel Settings',
  AUTH: {
    CLICK_CONNECT_WALLET: 'Clicked Connect Wallet',
    CLICK_SIGN_IN: 'Clicked Sign In',
    SIGN_IN_SUCCESS: 'Successful Sign In',
    SIGN_IN_FAILED: 'Failed Sign In',
    CLICK_SIGN_OUT: 'Clicked Sign Out'
  },
  CLICK_CONNECT_WALLET: 'Clicked Connect Wallet',
  CLICK_SWITCH_CHANNEL: 'Clicked Switch Channel',
  UPDATE_CHANNEL_INFO: 'Clicked Channel Info',
  CHANGE_CHANNEL_COVER: 'Clicked Channel Cover',
  UPLOADED_BYTE_VIDEO: 'Uploaded Byte Video',
  UPLOADED_TO_IPFS: 'Uploaded to IPFS',
  UPLOADED_TO_ARWEAVE: 'Uploaded to Arweave',
  UPDATED_CHANNEL_INFO: 'Updated Channel Info',
  DEPOSIT_MATIC: 'Deposit Matic',
  FILTER_CATEGORIES: 'Filter Categories',
  CLICK_CATEGORIES_SCROLL_BUTTON: 'Clicked Categories Scroll Button',
  CLICK_BYTES_SCROLL_BUTTON: 'Clicked Bytes Scroll Button',
  MIRROR_VIDEO: 'Mirrored Video',
  EMBED_VIDEO: {
    OPEN: 'Open Embed',
    COPY: 'Copy Embed',
    LOADED: 'Embed Video Loaded'
  },
  PROFILE_INTERESTS: {
    ADD: 'Add Profile Interest',
    REMOVE: 'Remove Profile Interest',
    VIEW: 'View Profile Interests'
  },
  NEW_COMMENT: 'New Comment',
  CLICK_VIDEO: 'Click Video',
  DELETE_VIDEO: 'Delete Video',
  DELETE_COMMENT: 'Delete Video Comment',
  CLICK_WATCH_LATER: 'Click Watch Later',
  CLICK_VIEW_METADATA: 'Click View Metadata',
  CLICK_VIEW_TOKEN: 'Click View Token',
  CHANNEL: {
    CLICK_CHANNEL_VIDEOS: 'Click Channel Videos',
    CLICK_CHANNEL_BYTES: 'Click Channel Bytes',
    CLICK_CHANNEL_COMMENTED: 'Click Channel Commented',
    CLICK_CHANNEL_MIRRORED: 'Click Channel Mirrored',
    CLICK_CHANNEL_NFTS: 'Click Channel NFTs',
    CLICK_OTHER_CHANNELS: 'Click Other Channels',
    CLICK_CHANNEL_STATS: 'Click Channel Stats',
    CLICK_CHANNEL_ABOUT: 'Click Channel About',
    CLICK_CHANNEL_COVER_LINKS: 'Click Channel Cover Links'
  },
  SUBSCRIBE_CHANNEL: 'Subscribe Channel',
  UNSUBSCRIBE_CHANNEL: 'Unsubscribe Channel',
  LIKE_VIDEO: 'Like Video',
  DISLIKE_VIDEO: 'Dislike Video',
  CLICK_VIDEO_OPTIONS: 'Click Video Options',
  NOTIFICATIONS: {
    CLICK_NOTIFICATIONS: 'Click Notifications',
    CLICK_MENTIONS: 'Click Mention Notifications',
    CLICK_COLLECTS: 'Click Collect Notifications',
    CLICK_ALL: 'Click All Notifications',
    CLICK_LIKES: 'Click Likes Notifications',
    CLICK_COMMENTS: 'Click Comment Notifications',
    CLICK_SUBSCRIPTIONS: 'Click Subscribe Notifications'
  },
  CLICK_USER_MENU: 'Click User Menu',
  OPENED_MUTUAL_CHANNELS: 'Opened Mutual Channels',
  COLLECT: {
    OPEN: 'Open Collect',
    FREE: 'Collected for Free',
    FEE: 'Collected for Fee'
  },
  TIP: {
    OPEN: 'Open Tip Modal',
    SENT: 'Sent Tip',
    COMMENT: 'New Tip Comment'
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
      THANKS: 'Click Thanks',
      ROADMAP: 'Click Roadmap',
      TERMS: 'Click Terms',
      PRIVACY: 'Click Privacy',
      STATUS: 'Click Status',
      TWITTER: 'Click Twitter'
    }
  },
  REPORT: 'Report Publication',
  CLICK_UPLOAD_VIDEO: 'Click Upload Video',
  PFP: {
    OPEN_MODAL: 'Open PFP Modal',
    CLICK_UPLOAD_TAB: 'Click Upload PFP tab',
    CLICK_NFTS_TAB: 'Click NFT tab',
    SELECT_NFT: 'Select PFP from NFT',
    UPLOAD_FROM_LOCAL: 'Upload PFP from Local',
    UPLOAD_FROM_COLLECTION: 'Upload PFP from Collection'
  },
  PAGE_VIEW: {
    HOME: 'Home Page',
    EXPLORE: 'Explore Page',
    CHANNEL: 'Channel Page',
    EXPLORE_TRENDING: 'Trending Page',
    EXPLORE_INTERESTING: 'Interesting Page',
    EXPLORE_POPULAR: 'Popular Page',
    EXPLORE_RECENT: 'Recents Page',
    EXPLORE_CURATED: 'Curated Page',
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
