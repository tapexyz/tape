import { useNavigation } from '@react-navigation/native'
import { ResizeMode, Video } from 'expo-av'
import { Image as ExpoImage } from 'expo-image'
import * as MediaLibrary from 'expo-media-library'
import React from 'react'
import { Pressable, StyleSheet, useWindowDimensions } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import useMobilePublicationStore from '~/store/publication'

const styles = StyleSheet.create({
  container: {
    height: '100%',
    borderRadius: 25
  },
  text: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(14),
    color: theme.colors.white
  }
})

const PreviewRenderer = () => {
  const { navigate } = useNavigation()
  const { height } = useWindowDimensions()

  const { mainFocus, asset } = useMobilePublicationStore(
    (state) => state.draftedPublication
  )

  return (
    <Pressable
      onPress={() => navigate('PickerModal', { mainFocus })}
      style={styles.container}
    >
      {asset ? (
        asset.mediaType === MediaLibrary.MediaType.photo ? (
          <ExpoImage
            source={{ uri: asset.uri }}
            transition={200}
            style={{ height: height / 2 }}
          />
        ) : (
          <Video
            shouldPlay
            isLooping
            resizeMode={ResizeMode.CONTAIN}
            source={{
              uri: asset.localUri as string
            }}
            style={{
              backgroundColor: theme.colors.backdrop,
              height: '100%'
            }}
          />
        )
      ) : null}
    </Pressable>
  )
}

export default PreviewRenderer
