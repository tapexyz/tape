import { VERIFIED_CHANNELS } from './verified'

export const FEATURE_FLAGS = {
  LENSTUBE_ECHOS: 'lenstube-echos',
  VIDEO_VIEWS: 'video-views'
}

export const featureFlags = [
  {
    flag: FEATURE_FLAGS.LENSTUBE_ECHOS,
    enabledFor: []
  },
  {
    flag: FEATURE_FLAGS.VIDEO_VIEWS,
    enabledFor: [...VERIFIED_CHANNELS]
  }
]
