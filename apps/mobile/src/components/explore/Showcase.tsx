import { STATIC_ASSETS } from '@lenstube/constants'
import { imageCdn } from '@lenstube/generic'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import React, { memo } from 'react'
import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import Animated, { FadeInRight } from 'react-native-reanimated'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { colors } from '~/helpers/theme'
import { useMobileTheme } from '~/hooks'
import { useMobilePersistStore } from '~/store/persist'

import { useToast } from '../common/toast'
import AnimatedPressable from '../ui/AnimatedPressable'

const BORDER_RADIUS = 30

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    container: {
      marginTop: 10,
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
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: themeConfig.borderColor
    },
    title: {
      fontFamily: 'font-bold',
      color: colors.white,
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
      color: colors.white,
      fontSize: normalizeFont(24)
    },
    whDescription: {
      fontFamily: 'font-medium',
      fontSize: normalizeFont(12),
      color: colors.secondary,
      letterSpacing: 0.8
    }
  })

const Showcase = () => {
  const { navigate } = useNavigation()
  const { showToast } = useToast()
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  const selectedProfile = useMobilePersistStore(
    (state) => state.selectedProfile
  )

  return (
    <View style={style.container}>
      <Animated.View entering={FadeInRight.duration(100)} style={style.card}>
        <AnimatedPressable
          onPress={() => {
            if (!selectedProfile) {
              return showToast({ text: 'Sign in with Lens' })
            }
            haptic()
          }}
        >
          <ImageBackground
            source={{
              uri: imageCdn(`${STATIC_ASSETS}/mobile/images/couch-garden.jpg`)
            }}
            style={style.image}
            imageStyle={{
              opacity: 0.8,
              backgroundColor: themeConfig.backgroudColor2
            }}
          >
            <LinearGradient colors={['transparent', '#00000080', '#00000090']}>
              <View style={style.whTextWrapper}>
                <Text style={style.whTitle}>Digital Crossovers</Text>
                <Text style={style.whDescription}>
                  Collectibles cross paths with friends.
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </AnimatedPressable>
      </Animated.View>
      <Animated.View entering={FadeInRight.duration(300)} style={style.grid}>
        <View style={style.gridCard}>
          <AnimatedPressable
            onPress={() => {
              haptic()
              navigate('PodcastModal')
            }}
          >
            <ImageBackground
              source={{
                uri: imageCdn(`${STATIC_ASSETS}/mobile/images/couch-watch.jpeg`)
              }}
              style={style.image}
              imageStyle={{
                opacity: 0.8,
                backgroundColor: themeConfig.backgroudColor2
              }}
            >
              <LinearGradient
                colors={['transparent', '#00000080', '#00000090']}
              >
                <Text style={style.title}>Podcast</Text>
              </LinearGradient>
            </ImageBackground>
          </AnimatedPressable>
        </View>
        <View style={style.gridCard}>
          <AnimatedPressable
            onPress={() => {
              haptic()
              navigate('MusicModal')
            }}
          >
            <ImageBackground
              source={{
                uri: imageCdn(
                  `${STATIC_ASSETS}/mobile/images/couch-listen.jpeg`
                )
              }}
              style={style.image}
              imageStyle={{
                opacity: 0.8,
                backgroundColor: themeConfig.backgroudColor2
              }}
            >
              <LinearGradient colors={['transparent', '#00000070', '#000000']}>
                <Text style={style.title}>Music</Text>
              </LinearGradient>
            </ImageBackground>
          </AnimatedPressable>
        </View>
      </Animated.View>
    </View>
  )
}

export default memo(Showcase)
