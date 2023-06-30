import { getPublicationHlsUrl, getThumbnailUrl } from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { ResizeMode, Video } from 'expo-av'
import { MotiView } from 'moti'
import type { FC } from 'react'
import React from 'react'
import { StyleSheet, useWindowDimensions } from 'react-native'

const styles = StyleSheet.create({
  byteCard: {
    justifyContent: 'center',
    borderRadius: 45
  }
})

type Props = {
  byte: Publication
  isActive: boolean
}

const ByteCard: FC<Props> = ({ byte, isActive }) => {
  const bottomTabBarHeight = useBottomTabBarHeight()
  const { height, width } = useWindowDimensions()
  const thumbnailUrl = getThumbnailUrl(byte)

  const BYTE_HEIGHT = height - bottomTabBarHeight

  return (
    <MotiView
      from={{
        opacity: 0,
        scale: 0.5
      }}
      animate={{
        opacity: 1,
        scale: 1
      }}
      transition={{
        type: 'timing'
      }}
      style={[styles.byteCard, { height: BYTE_HEIGHT, width }]}
    >
      <Video
        isLooping
        isMuted={false}
        useNativeControls
        shouldPlay={isActive}
        resizeMode={ResizeMode.COVER}
        source={{
          uri: getPublicationHlsUrl(byte)
        }}
        posterSource={{ uri: thumbnailUrl }}
        style={{ width, height: BYTE_HEIGHT }}
      />
    </MotiView>
  )
}

export default ByteCard
