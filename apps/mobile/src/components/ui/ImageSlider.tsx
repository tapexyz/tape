import { imageCdn, sanitizeDStorageUrl } from '@lenstube/generic'
import type { MediaSet } from '@lenstube/lens'
import { Image as ExpoImage } from 'expo-image'
import React, { memo, useState } from 'react'
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  }
})

const MAX_SHOW_COUNT = 4

const ImageSlider = ({ images }: { images: MediaSet[] }) => {
  const { themeConfig } = useMobileTheme()
  const [selectedItem, setSelectedItem] = useState(0)

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          aspectRatio: 1 / 1
        }}
      >
        {images.slice(0, MAX_SHOW_COUNT).map((image, index) => {
          const uri = imageCdn(sanitizeDStorageUrl(image.original.url))
          const selectedImage = selectedItem === index
          return (
            <View
              key={`${image.onChain.url}_${index}`}
              style={{
                flex: selectedImage ? MAX_SHOW_COUNT * 2 : 1,
                borderRadius: selectedImage ? 20 : 100,
                overflow: 'hidden',
                borderColor: themeConfig.borderColor,
                borderWidth: 1,
                marginRight:
                  images.length === 1 ? 0 : index === MAX_SHOW_COUNT - 1 ? 0 : 5
              }}
            >
              <Pressable
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  padding: 5
                }}
                onPress={() => setSelectedItem(index)}
              >
                <ImageBackground
                  source={{ uri }}
                  blurRadius={15}
                  style={StyleSheet.absoluteFillObject}
                  imageStyle={{
                    opacity: 0.5
                  }}
                >
                  <ExpoImage
                    source={{ uri }}
                    style={StyleSheet.absoluteFillObject}
                    transition={300}
                    contentFit={selectedImage ? 'contain' : 'cover'}
                  />
                </ImageBackground>
                {images.length > 1 && (
                  <View
                    style={{
                      display: selectedImage ? 'none' : 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: selectedImage
                          ? 'transparent'
                          : themeConfig.contrastBackgroundColor,
                        width: 15,
                        height: 15,
                        borderRadius: 100,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Text
                        style={{
                          color: themeConfig.contrastTextColor,
                          fontFamily: 'font-medium',
                          fontSize: normalizeFont(6)
                        }}
                      >
                        {index + 1}
                      </Text>
                    </View>
                  </View>
                )}
              </Pressable>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default memo(ImageSlider)
