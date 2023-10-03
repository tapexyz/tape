import { LENSTUBE_BYTES_APP_ID, STATIC_ASSETS } from '@lenstube/constants'
import { getIsDispatcherEnabled, imageCdn } from '@lenstube/generic'
import type { Profile, Publication } from '@lenstube/lens'
import { PublicationTypes, useProfilePostsQuery } from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { useWalletConnectModal } from '@walletconnect/modal-react-native'
import { Image as ExpoImage } from 'expo-image'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import Animated, { FadeInRight } from 'react-native-reanimated'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { colors } from '~/helpers/theme'
import { useMobileTheme } from '~/hooks'
import { useMobilePersistStore } from '~/store/persist'

import AnimatedPressable from '../ui/AnimatedPressable'

const BORDER_RADIUS = 25

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    container: {
      marginVertical: 10
    },
    card: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRadius: BORDER_RADIUS,
      width: 170,
      height: 170,
      padding: 18,
      borderWidth: 0.5,
      borderColor: themeConfig.borderColor
    },
    title: {
      fontFamily: 'font-bold',
      color: themeConfig.textColor,
      fontSize: normalizeFont(14)
    },
    subheading: {
      fontFamily: 'font-normal',
      color: themeConfig.secondaryTextColor,
      fontSize: normalizeFont(12)
    },
    cardTitle: {
      fontFamily: 'font-bold',
      opacity: 0.7,
      letterSpacing: 2,
      fontSize: normalizeFont(8),
      color: colors.black,
      textTransform: 'uppercase'
    },
    cardDescription: {
      fontFamily: 'font-bold',
      fontSize: normalizeFont(14),
      color: colors.black
    },
    icon: {
      width: 35,
      height: 35
    }
  })

const FirstSteps = () => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)
  const { open } = useWalletConnectModal()
  const accessToken = useMobilePersistStore((state) => state.accessToken)
  const selectedProfile = useMobilePersistStore(
    (state) => state.selectedProfile
  )

  const { data } = useProfilePostsQuery({
    variables: {
      request: {
        publicationTypes: [PublicationTypes.Post],
        limit: 1,
        sources: [LENSTUBE_BYTES_APP_ID],
        profileId: selectedProfile?.id
      }
    },
    skip: !selectedProfile?.id
  })
  const bytes = data?.publications?.items as Publication[]

  const dispatcherEnabled = getIsDispatcherEnabled(selectedProfile as Profile)
  const sharedByte = Boolean(bytes?.length)

  if (dispatcherEnabled && sharedByte && selectedProfile) {
    return null
  }

  return (
    <View style={style.container}>
      <Text style={style.title}>First steps with Lenstube</Text>
      <Text style={style.subheading}>Unleash New Social Horizons</Text>
      <Animated.View entering={FadeInRight}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6 }}
          style={{
            paddingTop: 20
          }}
        >
          {!accessToken && (
            <AnimatedPressable
              onPress={() => {
                haptic()
                open()
              }}
              style={[style.card, { backgroundColor: '#ACD8AA' }]}
            >
              <ExpoImage
                source={{
                  uri: imageCdn(
                    `${STATIC_ASSETS}/mobile/icons/arrow-with-scribble.png`
                  )
                }}
                transition={300}
                style={style.icon}
              />
              <View>
                <Text style={style.cardTitle}>Verify</Text>
                <Text style={style.cardDescription}>Login with Lens</Text>
              </View>
            </AnimatedPressable>
          )}
          {!dispatcherEnabled && (
            <AnimatedPressable
              onPress={() => haptic()}
              style={[style.card, { backgroundColor: '#F0E2A3' }]}
            >
              <ExpoImage
                source={{
                  uri: imageCdn(
                    `${STATIC_ASSETS}/mobile/icons/two-way-arrows.png`
                  )
                }}
                transition={300}
                style={style.icon}
              />
              <View>
                <Text style={style.cardTitle}>Wallet</Text>
                <Text style={style.cardDescription}>Enable Dispatcher</Text>
              </View>
            </AnimatedPressable>
          )}
          {!sharedByte && (
            <AnimatedPressable
              onPress={() => haptic()}
              style={[style.card, { backgroundColor: '#B3B3F1' }]}
            >
              <ExpoImage
                source={{
                  uri: imageCdn(`${STATIC_ASSETS}/mobile/icons/play-button.png`)
                }}
                transition={300}
                style={style.icon}
              />
              <View>
                <Text style={style.cardTitle}>Social</Text>
                <Text style={style.cardDescription}>Share your first Byte</Text>
              </View>
            </AnimatedPressable>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  )
}

export default FirstSteps
