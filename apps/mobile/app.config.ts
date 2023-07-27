import type { ConfigContext, ExpoConfig } from 'expo/config'

const config = ({ config }: ConfigContext): Partial<ExpoConfig> => {
  if (process.env.LENS_ENV === 'mainnet') {
    /* production config */
    return {
      ...config
    }
  } else {
    /* development config */
    return {
      ...config
    }
  }
}

export default config
