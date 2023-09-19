import Ionicons from '@expo/vector-icons/Ionicons'
import type { BottomSheetModal } from '@gorhom/bottom-sheet'
import { formatNumber, trimNewLines } from '@lenstube/generic'
import type { Post } from '@lenstube/lens'
import { LinearGradient } from 'expo-linear-gradient'
import type { FC } from 'react'
import React, { useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { colors, windowWidth } from '~/helpers/theme'

import UserProfile from '../common/UserProfile'
import CommentsSheet from '../sheets/CommentsSheet'
import AnimatedPressable from '../ui/AnimatedPressable'
import DoubleTap from '../ui/DoubleTap'

const styles = StyleSheet.create({
  info: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: windowWidth * 0.15,
    padding: 15,
    gap: 15
  },
  actions: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    alignItems: 'center'
  },
  verticalContainer: {
    flexDirection: 'column',
    borderRadius: 50,
    paddingVertical: 10,
    margin: 5,
    backgroundColor: `${colors.grey}50`
  },
  actionItem: {
    width: 45,
    height: 45,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginTop: 9,
    gap: 2
  },
  moreDots: {
    width: 45,
    height: 45,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 9,
    borderRadius: 100
  },
  text: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(10),
    color: colors.white
  }
})

type Props = {
  byte: Post
}

const Overlay: FC<Props> = ({ byte: { stats, by, metadata, id } }) => {
  const [showMoreContent, setShowMoreContent] = useState(false)
  const commentsSheetRef = useRef<BottomSheetModal>(null)

  return (
    <>
      <DoubleTap
        onDoubleTap={() => {
          haptic()
          alert('Liked')
        }}
      >
        <View style={StyleSheet.absoluteFill}>
          <LinearGradient
            locations={[0, 0, 0.8, 1]}
            style={StyleSheet.absoluteFill}
            colors={['transparent', 'transparent', 'transparent', '#00000090']}
          >
            <View style={styles.info}>
              <Pressable onPress={() => setShowMoreContent(!showMoreContent)}>
                <Text
                  numberOfLines={!showMoreContent ? 2 : undefined}
                  style={[styles.text, { fontSize: normalizeFont(12) }]}
                >
                  {showMoreContent
                    ? metadata.marketplace?.description
                    : trimNewLines(metadata.marketplace?.description ?? '')}
                </Text>
              </Pressable>
              <UserProfile
                profile={by}
                size={20}
                radius={6}
                handleStyle={{
                  fontSize: normalizeFont(12),
                  fontFamily: 'font-medium',
                  color: colors.white
                }}
              />
            </View>
          </LinearGradient>
          <View style={styles.actions}>
            <View style={styles.verticalContainer}>
              <AnimatedPressable style={styles.actionItem}>
                <Ionicons name="heart-outline" color={colors.white} size={20} />
                {stats.reactions ? (
                  <Text style={styles.text}>
                    {formatNumber(stats.reactions)}
                  </Text>
                ) : null}
              </AnimatedPressable>
              <AnimatedPressable
                style={styles.actionItem}
                onPress={() => {
                  haptic()
                  commentsSheetRef.current?.present()
                }}
              >
                <Ionicons
                  name="chatbubble-outline"
                  color={colors.white}
                  size={20}
                />
                {stats.comments ? (
                  <Text style={styles.text}>
                    {formatNumber(stats.comments)}
                  </Text>
                ) : null}
              </AnimatedPressable>
              <AnimatedPressable style={styles.actionItem}>
                <Ionicons name="sync-outline" color={colors.white} size={20} />
                {stats.mirrors ? (
                  <Text style={styles.text}>{formatNumber(stats.mirrors)}</Text>
                ) : null}
              </AnimatedPressable>
              <AnimatedPressable style={styles.actionItem}>
                <Ionicons
                  name="layers-outline"
                  color={colors.white}
                  size={20}
                />
                {stats.countOpenActions ? (
                  <Text style={styles.text}>
                    {formatNumber(stats.countOpenActions)}
                  </Text>
                ) : null}
              </AnimatedPressable>
            </View>
            <AnimatedPressable style={styles.moreDots}>
              <Ionicons
                name="ellipsis-vertical-outline"
                color={colors.white}
                size={20}
              />
            </AnimatedPressable>
          </View>
        </View>
      </DoubleTap>
      <CommentsSheet id={id} commentsSheetRef={commentsSheetRef} />
    </>
  )
}

export default Overlay
