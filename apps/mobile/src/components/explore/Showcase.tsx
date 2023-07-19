import { STATIC_ASSETS } from '@lenstube/constants'
import { imageCdn } from '@lenstube/generic'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { ImageBackground, StyleSheet, Text, View } from 'react-native'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

import AnimatedPressable from '../ui/AnimatedPressable'
import Stagger from '../ui/Stagger'

const BORDER_RADIUS = 30

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    gap: 10
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    gap: 10
  },
  gridCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS,
    height: 200,
    aspectRatio: 1 / 1,
    overflow: 'hidden',
    backgroundColor: theme.colors.backdrop
  },
  card: {
    flex: 1,
    borderRadius: BORDER_RADIUS,
    height: 200,
    width: '100%',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    contentFit: 'cover',
    justifyContent: 'flex-end',
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden'
  },
  title: {
    fontFamily: 'font-bold',
    color: theme.colors.white,
    fontSize: normalizeFont(24),
    paddingVertical: 8,
    paddingHorizontal: 18
  },
  whTextWrapper: {
    paddingVertical: 12,
    paddingHorizontal: 18
  },
  whTitle: {
    fontFamily: 'font-bold',
    color: theme.colors.white,
    fontSize: normalizeFont(24)
  },
  whDescription: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(12),
    color: theme.colors.secondary,
    letterSpacing: 0.8
  }
})

const Showcase = () => {
  const { navigate } = useNavigation()

  return (
    <View style={styles.container}>
      <Stagger>
        <View style={styles.grid}>
          <View style={styles.gridCard}>
            <AnimatedPressable onPress={() => haptic()}>
              <ImageBackground
                source={{
                  uri: imageCdn(
                    `${STATIC_ASSETS}/mobile/images/couch-podcast.jpg`
                  )
                }}
                style={styles.image}
                imageStyle={{
                  opacity: 0.8,
                  backgroundColor: theme.colors.backdrop
                }}
              >
                <LinearGradient
                  colors={['transparent', '#00000080', '#00000090']}
                >
                  <Text style={styles.title}>Podcasts</Text>
                </LinearGradient>
              </ImageBackground>
            </AnimatedPressable>
          </View>
          <View style={styles.gridCard}>
            <AnimatedPressable
              onPress={() => {
                haptic()
                navigate('MainTab', {
                  screen: 'ExploreStack',
                  params: { screen: 'Music' }
                })
              }}
            >
              <ImageBackground
                source={{
                  uri: imageCdn(
                    `${STATIC_ASSETS}/mobile/images/couch-music.jpg`
                  )
                }}
                style={styles.image}
                imageStyle={{
                  opacity: 0.8,
                  backgroundColor: theme.colors.backdrop
                }}
              >
                <LinearGradient
                  colors={['transparent', '#00000080', '#00000090']}
                >
                  <Text style={styles.title}>Music</Text>
                </LinearGradient>
              </ImageBackground>
            </AnimatedPressable>
          </View>
        </View>
      </Stagger>
      <Stagger>
        <View style={styles.card}>
          <AnimatedPressable onPress={() => haptic()}>
            <ImageBackground
              source={{
                uri: imageCdn(`${STATIC_ASSETS}/mobile/images/couch-garden.jpg`)
              }}
              style={styles.image}
              imageStyle={{
                opacity: 0.8,
                backgroundColor: theme.colors.backdrop
              }}
            >
              <LinearGradient
                colors={['transparent', '#00000080', '#00000090']}
              >
                <View style={styles.whTextWrapper}>
                  <Text style={styles.whTitle}>What's happening?</Text>
                  <Text style={styles.whDescription}>
                    Adventure awaits beyond the horizon.
                  </Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          </AnimatedPressable>
        </View>
      </Stagger>
    </View>
  )
}

export default Showcase
