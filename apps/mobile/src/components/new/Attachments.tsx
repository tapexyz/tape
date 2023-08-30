import Ionicons from '@expo/vector-icons/Ionicons'
import { PublicationMainFocus } from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import * as DocumentPicker from 'expo-document-picker'
import { Image as ExpoImage } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import * as VideoThumbnails from 'expo-video-thumbnails'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'
import useMobilePublicationStore from '~/store/publication'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    container: {
      borderRadius: 10,
      borderWidth: 0.5,
      borderColor: themeConfig.borderColor,
      overflow: 'hidden',
      padding: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    image: {
      aspectRatio: 16 / 9,
      height: 60,
      borderRadius: 5
    },
    text: {
      fontFamily: 'font-medium',
      fontSize: normalizeFont(10),
      color: themeConfig.textColor
    }
  })

const Attachments = () => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  const draftedPublication = useMobilePublicationStore(
    (state) => state.draftedPublication
  )
  const { mainFocus, poster } = draftedPublication
  const setDraftedPublication = useMobilePublicationStore(
    (state) => state.setDraftedPublication
  )

  const openDocumentPicker = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' })
    if (!result.canceled && result.assets[0].uri) {
      console.log('🚀 ~ file: Attachments.tsx ~ openPicker ~ result:', result)
      setDraftedPublication({
        ...draftedPublication,
        asset: result
      })
    }
  }

  const openMediaPicker = async (mediaTypes: ImagePicker.MediaTypeOptions) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes,
      allowsEditing: true,
      exif: false,
      aspect: [9, 16],
      allowsMultipleSelection: false,
      quality: 1,
      videoMaxDuration: 120 // 2 mins
    })

    if (result.assets) {
      const asset = result.assets[0]
      const { uri } = await VideoThumbnails.getThumbnailAsync(
        asset.uri as string,
        {
          time: 1
        }
      )
      setDraftedPublication({
        ...draftedPublication,
        asset: result,
        poster: uri
      })
    }
  }

  const openPicker = () => {
    if (mainFocus === PublicationMainFocus.Video) {
      return openMediaPicker(ImagePicker.MediaTypeOptions.Videos)
    }
    if (mainFocus === PublicationMainFocus.Image) {
      return openMediaPicker(ImagePicker.MediaTypeOptions.Images)
    }
    if (mainFocus === PublicationMainFocus.Audio) {
      openDocumentPicker()
    }
  }

  return (
    <View style={style.container}>
      {poster ? (
        <>
          <Pressable onPress={openPicker}>
            <ExpoImage
              source={{
                uri: poster
              }}
              contentFit="cover"
              transition={200}
              style={style.image}
            />
          </Pressable>
          <View style={{ paddingHorizontal: 15 }}>
            <Text style={style.text}>0%</Text>
          </View>
        </>
      ) : (
        <Pressable
          onPress={openPicker}
          style={{
            height: 60,
            flex: 1,
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Ionicons
            name="file-tray-outline"
            color={themeConfig.textColor}
            size={20}
          />
          <Text style={style.text}>Choose a {mainFocus.toLowerCase()}</Text>
        </Pressable>
      )}
    </View>
  )
}

export default Attachments
