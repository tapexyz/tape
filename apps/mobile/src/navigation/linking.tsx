/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import type { LinkingOptions } from '@react-navigation/native'
import Constants from 'expo-constants'
import { createURL } from 'expo-linking'

const prefix = createURL('/', { scheme: '/' })
const universalLinks = Constants.manifest?.extra?.universalLinks ?? []

// Visit https://reactnavigation.org/docs/configuring-links#playground to see more
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [prefix, ...universalLinks],
  config: {
    initialRouteName: 'MainTab',
    screens: {
      Settings: 'settings',
      MainTab: {
        screens: {
          VideoStack: {
            screens: {
              Video: 'video'
            }
          },
          HomeStack: {
            screens: {
              Home: '',
              Details: '/details/:id'
            }
          },
          AudioStack: {
            screens: {
              Audio: 'audio'
            }
          }
        }
      },
      SignIn: 'sign-in',
      SignUp: 'sign-up',
      NotFound: '*'
    }
  }
}
