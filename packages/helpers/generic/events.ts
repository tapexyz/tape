export const EVENTS = {
  AUTH: {
    CONNECT_WALLET: 'Connect Wallet',
    SIGN_IN_WITH_LENS: 'Sign in with Lens',
    SIGN_OUT: 'Sign Out'
  },
  CLICK_USER_MENU: 'Click User Menu',
  CLICK_VIEW_METADATA: 'Click View Metadata',
  CLICK_VIEW_PROOF: 'Click View Proof',
  CLICK_VIEW_TOKEN: 'Click View Token',
  DEPOSIT_MATIC: 'Deposit Matic',
  EMBED_VIDEO: {
    CLICK_COPY_URL: 'Click Embed Copy Url',
    CLICK_EMBED_PROFILE: 'Click Embed Profile',
    CLICK_EMBED_TITLE: 'Click Embed Title',
    CLICK_LISTEN_ON_TAPE: 'Click Listen on Tape',
    CLICK_WATCH_ON_TAPE: 'Click Watch on Tape',
    COPY: 'Copy Embed',
    LOADED: 'Embed Video Loaded',
    OPEN: 'Open Embed'
  },
  FILTER_CATEGORIES: 'Filter Categories',
  MANAGER: {
    TOGGLE: 'Toggle Lens Manager'
  },
  NOTIFICATIONS: {
    CLICK_NOTIFICATIONS: 'Click Notifications',
    SWITCH_NOTIFICATION_TAB: 'Switch notifications tab'
  },
  OPEN_ACTIONS: {
    COLLECT_ZORA: 'Collect Zora',
    OPEN_IN_UNLONELY: 'Open in Unlonely',
    OPEN_IN_ZORA: 'Open in Zora',
    WATCH_UNLONELY_LIVE: 'Watch Unlonely Live'
  },
  OPEN_COLLECT: 'Open Collect',
  PAGE_VIEW: {
    BANGERS: 'Bangers Page',
    BYTES: 'Bytes Page',
    EXPLORE: 'Explore Page',
    EXPLORE_INTERESTING: 'Interesting Page',
    EXPLORE_POPULAR: 'Popular Page',
    EXPLORE_TRENDING: 'Trending Page',
    FEED: 'Feed Page',
    HOME: 'Home Page',
    LISTEN: 'Listen Page',
    LOGIN: 'Login Page',
    NOTIFICATIONS: 'Notifications Page',
    PROFILE: 'Profile Page',
    SETTINGS: 'Settings Page',
    THANKS: 'Thanks Page',
    UPLOAD: {
      DROPZONE: 'DropZone Page',
      STEPS: 'Upload Steps Page'
    },
    WATCH: 'Watch Page',
    WATCH_STREAM: 'Watch Stream Page'
  },
  PAGEVIEW: 'Pageview',
  PROFILE: {
    CLICK_OTHER_PROFILES: 'Click Other Profiles',
    CLICK_PROFILE_AUDIOS: 'Click Profile Audios',
    CLICK_PROFILE_BYTES: 'Click Profile Bytes',
    CLICK_PROFILE_VIDEOS: 'Click Profile Videos',
    FOLLOW: 'Follow',
    REPORT: 'Report Profile',
    SETTINGS: {
      TOGGLE_REVERT_FOLLOW: 'Toggle Revert Follow'
    },
    SUPER_FOLLOW: 'Super Follow',
    UNFOLLOW: 'Unfollow',
    UPDATE: 'Update Profile'
  },
  PROFILE_INTERESTS: {
    ADD: 'Add Profile Interest',
    REMOVE: 'Remove Profile Interest',
    VIEW: 'View Profile Interests'
  },
  PUBLICATION: {
    COLLECT: 'Collect publication',
    DELETE: 'Delete publication',
    LIKE: 'Like publication',
    MIRROR: 'Mirror publication',
    NEW_COMMENT: 'New comment',
    NEW_POST: 'New post',
    PERMALINK: 'Permalink publication',
    PIN: 'Pin publication',
    REPORT: 'Report Publication',
    SHARE: {
      HEY: 'Share to Hey',
      LINKEDIN: 'Share to LinkedIn',
      REDDIT: 'Share to Reddit',
      X: 'Share to X'
    },
    TIP: {
      OPEN: 'Open Tip Modal',
      SENT: 'Tip Sent'
    },
    TOGGLE_INTEREST: 'Toggle Publication Interest',
    UNPIN: 'Unpin publication'
  },
  SEARCH: 'Search',
  SYSTEM: {
    MORE_MENU: {
      BRAND_KIT: 'Click Brand Kit',
      DISCORD: 'Click Discord',
      FEEDBACK: 'Click Feedback',
      GITHUB: 'Click Github',
      OPEN: 'Open More Menu',
      PRIVACY: 'Click Privacy',
      ROADMAP: 'Click Roadmap',
      STATUS: 'Click Status',
      TERMS: 'Click Terms',
      THANKS: 'Click Thanks',
      X: 'Click X'
    },
    TOGGLE_THEME: 'Toggle Theme'
  }
}

export const ALL_EVENTS = {
  ...EVENTS,
  ...EVENTS.PAGE_VIEW,
  ...EVENTS.PAGE_VIEW.UPLOAD,
  ...EVENTS.MANAGER,
  ...EVENTS.PUBLICATION,
  ...EVENTS.PUBLICATION.TIP,
  ...EVENTS.PUBLICATION.SHARE,
  ...EVENTS.OPEN_ACTIONS,
  ...EVENTS.AUTH,
  ...EVENTS.PROFILE,
  ...EVENTS.PROFILE.SETTINGS,
  ...EVENTS.SYSTEM,
  ...EVENTS.SYSTEM.MORE_MENU,
  ...EVENTS.NOTIFICATIONS,
  ...EVENTS.EMBED_VIDEO,
  ...EVENTS.PROFILE_INTERESTS
}
