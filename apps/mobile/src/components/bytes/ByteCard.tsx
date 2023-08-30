import {
  getPublicationMediaUrl,
  getThumbnailUrl,
  imageCdn,
  logger
} from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { ResizeMode, Video } from 'expo-av'
import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'
import { StyleSheet, useWindowDimensions, View } from 'react-native'

import { colors } from '~/helpers/theme'
import { useIsFocused } from '~/hooks/navigation'

import Overlay from './Overlay'

const styles = StyleSheet.create({
  byteCard: {
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: colors.backdrop
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

  const thumbnailUrl = imageCdn(getThumbnailUrl(byte, true), 'THUMBNAIL_V')
  const videoSource = getPublicationMediaUrl(byte)

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
      // videoRef.current?.setPositionAsync(0)
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
    <View style={[styles.byteCard, { height: BYTE_HEIGHT, width }]}>
      <Video
        ref={videoRef}
        isLooping
        isMuted={false}
        useNativeControls={false}
        shouldPlay={isActive}
        resizeMode={ResizeMode.COVER}
        source={{ uri: videoSource }}
        posterStyle={{ flex: 1, resizeMode: 'cover' }}
        usePoster={true}
        posterSource={{ uri: thumbnailUrl }}
        style={{ width, height: BYTE_HEIGHT }}
      />

      <Overlay byte={byte} />
    </View>
  )
}

export default ByteCard
