import { PublicationMetadataMainFocusType } from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'
import useMobilePublicationStore from '~/store/publication'

import AnimatedPressable from '../ui/AnimatedPressable'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      marginBottom: 10,
      gap: 5
    },
    filter: {
      paddingVertical: 7,
      paddingHorizontal: 15,
      borderRadius: 25,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 0.5,
      borderColor: themeConfig.borderColor
    },
    text: {
      fontFamily: 'font-medium',
      fontSize: normalizeFont(8),
      letterSpacing: 1,
      textTransform: 'uppercase'
    },
    image: {
      width: 20,
      height: 20
    }
  })

const ChooseFocus = () => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  const draftedPublication = useMobilePublicationStore(
    (state) => state.draftedPublication
  )
  const setDraftedPublication = useMobilePublicationStore(
    (state) => state.setDraftedPublication
  )

  const onChoose = (mainFocus: PublicationMetadataMainFocusType) => {
    setDraftedPublication({
      ...draftedPublication,
      mainFocus
    })
  }

  return (
    <View style={style.container}>
      <AnimatedPressable
        onPress={() => onChoose(PublicationMetadataMainFocusType.Video)}
        style={[
          style.filter,
          {
            backgroundColor:
              draftedPublication.mainFocus ===
              PublicationMetadataMainFocusType.Video
                ? themeConfig.contrastBackgroundColor
                : themeConfig.backgroudColor
          }
        ]}
      >
        <Text
          style={[
            style.text,
            {
              color:
                draftedPublication.mainFocus ===
                PublicationMetadataMainFocusType.Video
                  ? themeConfig.contrastTextColor
                  : themeConfig.textColor
            }
          ]}
        >
          Byte
        </Text>
      </AnimatedPressable>

      <AnimatedPressable
        onPress={() => onChoose(PublicationMetadataMainFocusType.Audio)}
        style={[
          style.filter,
          {
            backgroundColor:
              draftedPublication.mainFocus ===
              PublicationMetadataMainFocusType.Audio
                ? themeConfig.contrastBackgroundColor
                : themeConfig.backgroudColor
          }
        ]}
      >
        <Text
          style={[
            style.text,
            {
              color:
                draftedPublication.mainFocus ===
                PublicationMetadataMainFocusType.Audio
                  ? themeConfig.contrastTextColor
                  : themeConfig.textColor
            }
          ]}
        >
          Audio
        </Text>
      </AnimatedPressable>

      <AnimatedPressable
        onPress={() => onChoose(PublicationMetadataMainFocusType.Image)}
        style={[
          style.filter,
          {
            backgroundColor:
              draftedPublication.mainFocus ===
              PublicationMetadataMainFocusType.Image
                ? themeConfig.contrastBackgroundColor
                : themeConfig.backgroudColor
          }
        ]}
      >
        <Text
          style={[
            style.text,
            {
              color:
                draftedPublication.mainFocus ===
                PublicationMetadataMainFocusType.Image
                  ? themeConfig.contrastTextColor
                  : themeConfig.textColor
            }
          ]}
        >
          Image
        </Text>
      </AnimatedPressable>
    </View>
  )
}

export default ChooseFocus
