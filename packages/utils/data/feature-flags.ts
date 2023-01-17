export const FEATURE_FLAGS = {
  LENSTUBE_ECHOS: 'lenstube-echos',
  VIDEO_VIEWS: 'video-views'
}

export const featureFlags = [
  {
    flag: FEATURE_FLAGS.LENSTUBE_ECHOS,
    enabledFor: ['0x2d']
  },
  {
    flag: FEATURE_FLAGS.VIDEO_VIEWS,
    enabledFor: ['0x2d', '0x24', '0x8e']
  }
]
