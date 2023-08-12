import { imageCdn, sanitizeDStorageUrl } from '@lenstube/generic'
import type { MediaSet } from '@lenstube/lens'
import { Image as ExpoImage } from 'expo-image'
import { MotiText, MotiView } from 'moti'
import React, { memo, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Animated, { Easing, FadeIn, FadeOut } from 'react-native-reanimated'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  }
})

const MAX_SHOW_COUNT = 4

const ImageSlider = ({ images }: { images: MediaSet[] }) => {
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
            <MotiView
              key={`${image.onChain.url}_${index}`}
              animate={{
                flex: selectedItem === index ? MAX_SHOW_COUNT * 2 : 1
              }}
              transition={{
                type: 'timing',
                duration: 500,
                easing: Easing.inOut(Easing.ease)
              }}
              style={{
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
                onPress={() => {
                  setSelectedItem(index)
                }}
              >
                <ExpoImage
                  source={{
                    uri: imageCdn(sanitizeDStorageUrl(image.original.url))
                  }}
                  style={[
                    StyleSheet.absoluteFillObject,
                    { backgroundColor: theme.colors.backdrop }
                  ]}
                  transition={300}
                  contentFit="cover"
                />
                {images.length > 1 && (
                  <Animated.View
                    style={{
                      display: selectedItem === index ? 'none' : 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <MotiView
                      animate={{
                        backgroundColor:
                          selectedItem === index
                            ? 'transparent'
                            : theme.colors.white
                      }}
                      transition={{
                        type: 'timing',
                        duration: 500
                      }}
                      style={{
                        width: 15,
                        height: 15,
                        borderRadius: 100,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <MotiText
                        animate={{
                          opacity: selectedItem === index ? 0 : 1
                        }}
                        style={{
                          color: theme.colors.black,
                          fontFamily: 'font-medium',
                          fontSize: normalizeFont(6)
                        }}
                        entering={FadeIn.delay(50)}
                        exiting={FadeOut.delay(100)}
                      >
                        {index + 1}
                      </MotiText>
                    </MotiView>
                  </Animated.View>
                )}
              </Pressable>
            </MotiView>
          )
        })}
      </View>
    </View>
  )
}

export default memo(ImageSlider)
