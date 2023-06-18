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
          HomeStack: {
            // initialRouteName: 'Home',
            screens: {
              Home: '',
              Details: '/details/:id'
            }
          },
          ExamplesStack: {
            // initialRouteName: 'Examples',
            screens: {
              Examples: '/examples',
              Components: '/components',
              Colors: '/colors',
              Typography: '/typography'
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
