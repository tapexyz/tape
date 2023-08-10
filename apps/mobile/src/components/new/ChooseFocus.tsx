import { PublicationMainFocus } from '@lenstube/lens'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import useMobilePublicationStore from '~/store/publication'

import AnimatedPressable from '../ui/AnimatedPressable'

const styles = StyleSheet.create({
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

  return (
    <View style={styles.container}>
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
    </View>
  )
}

export default ChooseFocus
