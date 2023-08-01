import {
  formatNumber,
  getProfilePicture,
  trimLensHandle
} from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import { useAllProfilesQuery } from '@lenstube/lens'
import { AnimatedFlashList } from '@shopify/flash-list'
import { Image as ExpoImage } from 'expo-image'
import React, { useCallback } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import useMobileStore from '~/store'

import AnimatedPressable from '../ui/AnimatedPressable'

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: 8,
    margin: 5,
    padding: 8,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: theme.colors.black
  },
  otherInfo: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(10),
    color: theme.colors.white,
    opacity: 0.6
  },
  handle: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(12),
    color: theme.colors.white
  }
})

const Switch = () => {
  const selectedChannel = useMobileStore((state) => state.selectedChannel)
  const setSelectedChannel = useMobileStore((state) => state.setSelectedChannel)

  const renderItem = useCallback(
    ({ item, index }: { item: Profile; index: number }) => (
      <Animated.View
        style={{ flex: 1 }}
        entering={FadeInDown.delay(index * 100)}
      >
        <AnimatedPressable
          key={item.id}
          style={[
            styles.card,
            {
              borderWidth: 2,
              borderColor:
                selectedChannel?.id === item.id
                  ? theme.colors.grey
                  : theme.colors.black
            }
          ]}
          onPress={() => {
            setSelectedChannel(item)
            haptic()
          }}
        >
          <ExpoImage
            source={{
              uri: getProfilePicture(item)
            }}
            contentFit="cover"
            transition={500}
            style={{ width: 30, height: 30, borderRadius: 8 }}
          />
          <View>
            <Text numberOfLines={1} style={styles.handle}>
              {trimLensHandle(item.handle)}
            </Text>
            <Text style={styles.otherInfo}>
              {formatNumber(item.stats.totalFollowers)} followers
            </Text>
          </View>
        </AnimatedPressable>
      </Animated.View>
    ),
    [selectedChannel, setSelectedChannel]
  )

  const { data, loading } = useAllProfilesQuery({
    variables: {
      request: { ownedBy: [selectedChannel?.ownedBy] }
    }
  })
  const profiles = data?.profiles?.items as Profile[]

  if (loading || !profiles?.length) {
    return <ActivityIndicator style={{ flex: 1 }} />
  }

  return (
    <AnimatedFlashList
      numColumns={2}
      data={profiles}
      renderItem={renderItem}
      estimatedItemSize={profiles.length}
      keyExtractor={(item, i) => `${item.id}_${i}`}
      extraData={selectedChannel} // To handle rerender if profile changes
    />
  )
}

export default Switch
