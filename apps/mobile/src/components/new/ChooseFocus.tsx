import { PublicationMainFocus } from '@lenstube/lens'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { ScrollView, StyleSheet, Text } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import useMobilePublicationStore from '~/store/publication'

import AnimatedPressable from '../ui/AnimatedPressable'

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
    marginVertical: 20
  },
  filter: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center'
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
  const { navigate } = useNavigation()
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
    navigate('PickerModal')
  }

  return (
    <ScrollView
      style={styles.container}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    >
      <AnimatedPressable
        onPress={() => onChoose(PublicationMainFocus.TextOnly)}
        style={[
          styles.filter,
          {
            backgroundColor:
              draftedPublication.mainFocus === PublicationMainFocus.TextOnly
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
                draftedPublication.mainFocus === PublicationMainFocus.TextOnly
                  ? theme.colors.black
                  : theme.colors.white
            }
          ]}
        >
          Post
        </Text>
      </AnimatedPressable>

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
          Bytes
        </Text>
      </AnimatedPressable>

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
          Video
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
          Story
        </Text>
      </AnimatedPressable>

      <AnimatedPressable
        onPress={() => onChoose(PublicationMainFocus.TextOnly)}
        style={[
          styles.filter,
          {
            backgroundColor:
              draftedPublication.mainFocus === PublicationMainFocus.TextOnly
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
                draftedPublication.mainFocus === PublicationMainFocus.TextOnly
                  ? theme.colors.black
                  : theme.colors.white
            }
          ]}
        >
          Event
        </Text>
      </AnimatedPressable>

      <AnimatedPressable
        onPress={() => onChoose(PublicationMainFocus.TextOnly)}
        style={[
          styles.filter,
          {
            backgroundColor:
              draftedPublication.mainFocus === PublicationMainFocus.TextOnly
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
                draftedPublication.mainFocus === PublicationMainFocus.TextOnly
                  ? theme.colors.black
                  : theme.colors.white
            }
          ]}
        >
          Check In
        </Text>
      </AnimatedPressable>
    </ScrollView>
  )
}

export default ChooseFocus
