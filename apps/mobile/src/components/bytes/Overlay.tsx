import Ionicons from '@expo/vector-icons/Ionicons'
import { formatNumber, trimNewLines } from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import type { FC } from 'react'
import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { colors, windowWidth } from '~/helpers/theme'

import UserProfile from '../common/UserProfile'
import AnimatedPressable from '../ui/AnimatedPressable'

const styles = StyleSheet.create({
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
    color: colors.white
  }
})

type Props = {
  byte: Publication
}

const Overlay: FC<Props> = ({ byte: { stats, profile, metadata } }) => {
  const [showMoreContent, setShowMoreContent] = useState(false)

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.info}>
        <Pressable onPress={() => setShowMoreContent(!showMoreContent)}>
          <Text
            numberOfLines={!showMoreContent ? 2 : undefined}
            style={[styles.text, { fontSize: normalizeFont(12) }]}
          >
            {showMoreContent
              ? metadata.content
              : trimNewLines(metadata.content ?? '')}
          </Text>
        </Pressable>
        <UserProfile
          profile={profile}
          size={20}
          radius={6}
          handleStyle={{
            fontSize: normalizeFont(12),
            fontFamily: 'font-medium',
            color: colors.white
          }}
        />
      </View>
      <View style={styles.actions}>
        <View style={styles.verticalContainer}>
          <AnimatedPressable style={styles.actionItem}>
            <Ionicons name="heart-outline" color={colors.white} size={20} />
            {stats.totalUpvotes ? (
              <Text style={styles.text}>
                {formatNumber(stats.totalUpvotes)}
              </Text>
            ) : null}
          </AnimatedPressable>
          <AnimatedPressable style={styles.actionItem}>
            <Ionicons
              name="chatbubble-outline"
              color={colors.white}
              size={20}
            />
            {stats.totalAmountOfComments ? (
              <Text style={styles.text}>
                {formatNumber(stats.totalAmountOfComments)}
              </Text>
            ) : null}
          </AnimatedPressable>
          <AnimatedPressable style={styles.actionItem}>
            <Ionicons name="sync-outline" color={colors.white} size={20} />
            {stats.totalAmountOfMirrors ? (
              <Text style={styles.text}>
                {formatNumber(stats.totalAmountOfMirrors)}
              </Text>
            ) : null}
          </AnimatedPressable>
          <AnimatedPressable style={styles.actionItem}>
            <Ionicons name="layers-outline" color={colors.white} size={20} />
            {stats.totalAmountOfCollects ? (
              <Text style={styles.text}>
                {formatNumber(stats.totalAmountOfCollects)}
              </Text>
            ) : null}
          </AnimatedPressable>
          <AnimatedPressable style={styles.actionItem}>
            <Ionicons
              name="ellipsis-vertical-outline"
              color={colors.white}
              size={20}
            />
          </AnimatedPressable>
        </View>
      </View>
    </View>
  )
}

export default Overlay
