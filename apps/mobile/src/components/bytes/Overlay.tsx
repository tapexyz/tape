import Ionicons from '@expo/vector-icons/Ionicons'
import { formatNumber, trimNewLines } from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import type { FC } from 'react'
import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { windowWidth } from '~/helpers/theme'
import { useMobileTheme } from '~/hooks'

import UserProfile from '../common/UserProfile'
import AnimatedPressable from '../ui/AnimatedPressable'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    info: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: windowWidth * 0.08,
      padding: 15,
      gap: 15
    },
    actions: {
      position: 'absolute',
      bottom: 0,
      right: 0
    },
    verticalContainer: {
      flexDirection: 'column',
      gap: 7,
      paddingBottom: 5
    },
    actionItem: {
      width: 45,
      height: 45,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 100,
      gap: 4
    },
    text: {
      fontFamily: 'font-medium',
      fontSize: normalizeFont(10),
      color: themeConfig.textColor
    }
  })

type Props = {
  byte: Publication
}

const Overlay: FC<Props> = ({ byte: { stats, profile, metadata } }) => {
  const { themeConfig } = useMobileTheme()

  const [showMoreContent, setShowMoreContent] = useState(false)

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles(themeConfig).info}>
        <Pressable onPress={() => setShowMoreContent(!showMoreContent)}>
          <Text
            numberOfLines={!showMoreContent ? 2 : undefined}
            style={[styles(themeConfig).text, { fontSize: normalizeFont(12) }]}
          >
            {showMoreContent
              ? metadata.name
              : trimNewLines(metadata.name ?? '')}
          </Text>
        </Pressable>
        <UserProfile
          profile={profile}
          size={20}
          radius={6}
          handleStyle={{
            fontSize: normalizeFont(12),
            fontFamily: 'font-medium'
          }}
        />
      </View>
      <View style={styles(themeConfig).actions}>
        <View style={styles(themeConfig).verticalContainer}>
          <AnimatedPressable style={styles(themeConfig).actionItem}>
            <Ionicons
              name="heart-outline"
              color={themeConfig.textColor}
              size={20}
            />
            {stats.totalUpvotes ? (
              <Text style={styles(themeConfig).text}>
                {formatNumber(stats.totalUpvotes)}
              </Text>
            ) : null}
          </AnimatedPressable>
          <AnimatedPressable style={styles(themeConfig).actionItem}>
            <Ionicons
              name="chatbubble-outline"
              color={themeConfig.textColor}
              size={20}
            />
            {stats.totalAmountOfComments ? (
              <Text style={styles(themeConfig).text}>
                {formatNumber(stats.totalAmountOfComments)}
              </Text>
            ) : null}
          </AnimatedPressable>
          <AnimatedPressable style={styles(themeConfig).actionItem}>
            <Ionicons
              name="sync-outline"
              color={themeConfig.textColor}
              size={20}
            />
            {stats.totalAmountOfMirrors ? (
              <Text style={styles(themeConfig).text}>
                {formatNumber(stats.totalAmountOfMirrors)}
              </Text>
            ) : null}
          </AnimatedPressable>
          <AnimatedPressable style={styles(themeConfig).actionItem}>
            <Ionicons
              name="grid-outline"
              color={themeConfig.textColor}
              size={17}
            />
            {stats.totalAmountOfCollects ? (
              <Text style={styles(themeConfig).text}>
                {formatNumber(stats.totalAmountOfCollects)}
              </Text>
            ) : null}
          </AnimatedPressable>
          <AnimatedPressable style={styles(themeConfig).actionItem}>
            <Ionicons
              name="ellipsis-vertical-outline"
              color={themeConfig.textColor}
              size={20}
            />
          </AnimatedPressable>
        </View>
      </View>
    </View>
  )
}

export default Overlay
