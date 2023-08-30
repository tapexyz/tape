import { imageCdn, sanitizeDStorageUrl } from '@lenstube/generic'
import type { MediaSet } from '@lenstube/lens'
import { Image as ExpoImage } from 'expo-image'
import React, { memo, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

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
          return (
            <View
              key={`${image.onChain.url}_${index}`}
              style={{
                flex: selectedItem === index ? MAX_SHOW_COUNT * 2 : 1,
                borderRadius: 20,
                overflow: 'hidden',
                marginRight: index === MAX_SHOW_COUNT - 1 ? 0 : 5
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
                <ExpoImage
                  source={{
                    uri: imageCdn(sanitizeDStorageUrl(image.original.url))
                  }}
                  style={[
                    StyleSheet.absoluteFillObject,
                    { backgroundColor: themeConfig.backgroudColor2 }
                  ]}
                  transition={300}
                  contentFit="cover"
                />
                {images.length > 1 && (
                  <View
                    style={{
                      display: selectedItem === index ? 'none' : 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <View
                      style={{
                        backgroundColor:
                          selectedItem === index
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
