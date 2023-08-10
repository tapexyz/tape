import { PublicationMainFocus } from '@lenstube/lens'
import React from 'react'
import { StyleSheet, Text } from 'react-native'
import Animated, { SlideInLeft } from 'react-native-reanimated'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import useMobilePublicationStore from '~/store/publication'

import AnimatedPressable from '../ui/AnimatedPressable'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginVertical: 20,
    gap: 5
  },
  filter: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: theme.colors.grey
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
  const draftedPublication = useMobilePublicationStore(
    (state) => state.draftedPublication
  )
  const setDraftedPublication = useMobilePublicationStore(
    (state) => state.setDraftedPublication
  )

  const onChoose = (mainFocus: PublicationMainFocus) => {
    setDraftedPublication({
      ...draftedPublication,
      mainFocus
    })
  }

  if (!draftedPublication.hasAttachment) {
    return null
  }

  return (
    <Animated.View
      style={styles.container}
      entering={SlideInLeft.duration(300)}
    >
      <AnimatedPressable
        onPress={() => onChoose(PublicationMainFocus.Video)}
        style={[
          styles.filter,
          {
            backgroundColor:
              draftedPublication.mainFocus === PublicationMainFocus.Video
                ? theme.colors.white
                : theme.colors.black
          }
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              color:
                draftedPublication.mainFocus === PublicationMainFocus.Video
                  ? theme.colors.black
                  : theme.colors.white
            }
          ]}
        >
          Byte
        </Text>
      </AnimatedPressable>

      <AnimatedPressable
        onPress={() => onChoose(PublicationMainFocus.Audio)}
        style={[
          styles.filter,
          {
            backgroundColor:
              draftedPublication.mainFocus === PublicationMainFocus.Audio
                ? theme.colors.white
                : theme.colors.black
          }
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              color:
                draftedPublication.mainFocus === PublicationMainFocus.Audio
                  ? theme.colors.black
                  : theme.colors.white
            }
          ]}
        >
          Audio
        </Text>
      </AnimatedPressable>
    </Animated.View>
  )
}

export default ChooseFocus
