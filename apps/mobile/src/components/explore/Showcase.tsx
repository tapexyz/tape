import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { MotiView } from 'moti'
import { MotiPressable } from 'moti/interactions'
import React, { useMemo } from 'react'
import { ImageBackground, StyleSheet, Text, View } from 'react-native'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

const BORDER_RADIUS = 25

const styles = StyleSheet.create({
  container: {
    margin: 10,
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
    overflow: 'hidden'
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
    paddingVertical: 6,
    paddingHorizontal: 15
  },
  whTextWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 15
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
  const animatePress = useMemo(
    () =>
      ({ pressed }: { pressed: boolean }) => {
        'worklet'
        return {
          scale: pressed ? 0.97 : 1
        }
      },
    []
  )

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        <MotiView
          style={styles.gridCard}
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: 'timing',
            duration: 350
          }}
        >
          <MotiPressable animate={animatePress} onPress={() => haptic()}>
            <ImageBackground
              source={require('assets/images/couch-podcast.jpg')}
              style={styles.image}
              imageStyle={{ opacity: 0.8 }}
            >
              <LinearGradient
                colors={['transparent', '#00000080', '#00000090']}
              >
                <Text style={styles.title}>Podcasts</Text>
              </LinearGradient>
            </ImageBackground>
          </MotiPressable>
        </MotiView>
        <MotiView
          style={styles.gridCard}
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: 'timing',
            duration: 350
          }}
        >
          <MotiPressable
            animate={animatePress}
            onPress={() => {
              haptic()
              navigate('Music')
            }}
          >
            <ImageBackground
              source={require('assets/images/couch-music.jpg')}
              style={styles.image}
              imageStyle={{ opacity: 0.8 }}
            >
              <LinearGradient
                colors={['transparent', '#00000080', '#00000090']}
              >
                <Text style={styles.title}>Music</Text>
              </LinearGradient>
            </ImageBackground>
          </MotiPressable>
        </MotiView>
      </View>
      <MotiView
        style={styles.card}
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: 'timing',
          duration: 350
        }}
      >
        <MotiPressable animate={animatePress} onPress={() => haptic()}>
          <ImageBackground
            source={require('assets/images/couch-garden.jpg')}
            style={styles.image}
            imageStyle={{ opacity: 0.8 }}
          >
            <LinearGradient colors={['transparent', '#00000080', '#00000090']}>
              <View style={styles.whTextWrapper}>
                <Text style={styles.whTitle}>What's happening?</Text>
                <Text style={styles.whDescription}>
                  Adventure awaits beyond the horizon.
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </MotiPressable>
      </MotiView>
    </View>
  )
}

export default Showcase
