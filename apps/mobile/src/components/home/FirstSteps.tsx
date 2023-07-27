import { LENSTUBE_BYTES_APP_ID, STATIC_ASSETS } from '@lenstube/constants'
import { getIsDispatcherEnabled, imageCdn } from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import { PublicationTypes, useProfilePostsQuery } from '@lenstube/lens'
import { useWalletConnectModal } from '@walletconnect/modal-react-native'
import { Image as ExpoImage } from 'expo-image'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import * as Animatable from 'react-native-animatable'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import useMobileStore from '~/store'
import { hydrateAuthTokens } from '~/store/persist'

import AnimatedPressable from '../ui/AnimatedPressable'

const BORDER_RADIUS = 25

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 5
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: BORDER_RADIUS,
    width: 170,
    height: 170,
    padding: 18,
    marginRight: 6
  },
  title: {
    fontFamily: 'font-bold',
    color: theme.colors.white,
    fontSize: normalizeFont(14)
  },
  subheading: {
    fontFamily: 'font-normal',
    color: theme.colors.secondary,
    fontSize: normalizeFont(12)
  },
  cardTitle: {
    fontFamily: 'font-bold',
    opacity: 0.7,
    letterSpacing: 2,
    fontSize: normalizeFont(8),
    color: theme.colors.black,
    textTransform: 'uppercase'
  },
  cardDescription: {
    fontFamily: 'font-bold',
    fontSize: normalizeFont(14),
    color: theme.colors.black
  },
  icon: {
    width: 35,
    height: 35
  }
})

const FirstSteps = () => {
  const { open } = useWalletConnectModal()
  const selectedChannel = useMobileStore((state) => state.selectedChannel)
  const { accessToken } = hydrateAuthTokens()

  const { data } = useProfilePostsQuery({
    variables: {
      request: {
        publicationTypes: [PublicationTypes.Post],
        limit: 1,
        sources: [LENSTUBE_BYTES_APP_ID],
        profileId: selectedChannel?.id
      }
    },
    skip: !selectedChannel?.id
  })
  const bytes = data?.publications?.items as Publication[]

  const dispatcherEnabled = getIsDispatcherEnabled(selectedChannel)
  const sharedByte = Boolean(bytes?.length)

  if (dispatcherEnabled && sharedByte && selectedChannel) {
    return null
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>First steps with Pripe</Text>
      <Text style={styles.subheading}>Unleash New Social Horizons</Text>
      <Animatable.View
        useNativeDriver
        animation={{
          0: {
            opacity: 0,
            translateX: 50
          },
          1: {
            opacity: 1,
            translateX: 0
          }
        }}
        delay={300}
      >
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
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
              style={[styles.card, { backgroundColor: '#ACD8AA' }]}
            >
              <ExpoImage
                source={{
                  uri: imageCdn(
                    `${STATIC_ASSETS}/mobile/icons/arrow-with-scribble.png`
                  )
                }}
                style={styles.icon}
              />
              <View>
                <Text style={styles.cardTitle}>SIWL</Text>
                <Text style={styles.cardDescription}>Sign in with Lens</Text>
              </View>
            </AnimatedPressable>
          )}
          {!dispatcherEnabled && (
            <AnimatedPressable
              onPress={() => haptic()}
              style={[styles.card, { backgroundColor: '#F0E2A3' }]}
            >
              <ExpoImage
                source={{
                  uri: imageCdn(
                    `${STATIC_ASSETS}/mobile/icons/two-way-arrows.png`
                  )
                }}
                style={styles.icon}
              />
              <View>
                <Text style={styles.cardTitle}>Wallet</Text>
                <Text style={styles.cardDescription}>Enable Dispatcher</Text>
              </View>
            </AnimatedPressable>
          )}
          {!sharedByte && (
            <AnimatedPressable
              onPress={() => haptic()}
              style={[styles.card, { backgroundColor: '#B3B3F1' }]}
            >
              <ExpoImage
                source={{
                  uri: imageCdn(`${STATIC_ASSETS}/mobile/icons/play-button.png`)
                }}
                style={styles.icon}
              />
              <View>
                <Text style={styles.cardTitle}>Lens</Text>
                <Text style={styles.cardDescription}>
                  Share your first Byte
                </Text>
              </View>
            </AnimatedPressable>
          )}
        </ScrollView>
      </Animatable.View>
    </View>
  )
}

export default FirstSteps
