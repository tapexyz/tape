import {
  getPublicationMediaUrl,
  getThumbnailUrl,
  logger
} from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useIsFocused } from '@react-navigation/native'
import { ResizeMode, Video } from 'expo-av'
import { MotiView } from 'moti'
import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'
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
  const isFocused = useIsFocused()
  const videoRef = useRef<Video>(null)

  const bottomTabBarHeight = useBottomTabBarHeight()
  const { height, width } = useWindowDimensions()
  const BYTE_HEIGHT = height - bottomTabBarHeight

  const thumbnailUrl = getThumbnailUrl(byte)

  const pauseVideo = () => {
    try {
      videoRef.current?.setPositionAsync(0)
      videoRef.current?.pauseAsync()
    } catch (error) {
      logger.error('🚀 ~ file: ByteCard.tsx ~ pauseVideo ~ error:', error)
    }
  }

  const playVideo = () => {
    try {
      videoRef.current?.setPositionAsync(0)
      videoRef.current?.playAsync()
    } catch (error) {
      logger.error('🚀 ~ file: ByteCard.tsx ~ playVideo ~ error:', error)
    }
  }

  useEffect(() => {
    if (isFocused && isActive) {
      playVideo()
    }
    if (!isFocused || !isActive) {
      pauseVideo()
    }
  }, [isFocused, isActive])

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
        ref={videoRef}
        isLooping
        isMuted={false}
        useNativeControls
        shouldPlay={isActive}
        resizeMode={ResizeMode.COVER}
        source={{
          uri: getPublicationMediaUrl(byte)
        }}
        posterSource={{ uri: thumbnailUrl }}
        style={{ width, height: BYTE_HEIGHT }}
      />
    </MotiView>
  )
}

export default ByteCard
