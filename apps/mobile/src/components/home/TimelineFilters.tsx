import Ionicons from '@expo/vector-icons/Ionicons'
import { STATIC_ASSETS } from '@lenstube/constants'
import { imageCdn } from '@lenstube/generic'
import { TimelineFeedType } from '@lenstube/lens/custom-types'
import { useNavigation } from '@react-navigation/native'
import { Image as ExpoImage } from 'expo-image'
import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'
import useMobileHomeFeedStore from '~/store/feed'
import { useMobilePersistStore } from '~/store/persist'

import { useToast } from '../common/toast'

const styles = StyleSheet.create({
  container: {
    marginVertical: 20
  },
  filter: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 25
  },
  text: {
    fontFamily: 'font-bold',
    fontSize: normalizeFont(12)
  },
  image: {
    width: 20,
    height: 20
  }
})

const TimelineFilters = () => {
  const { themeConfig } = useMobileTheme()
  const { navigate } = useNavigation()
  const { showToast } = useToast()

  const selectedProfile = useMobilePersistStore(
    (state) => state.selectedProfile
  )
  const selectedFeedType = useMobileHomeFeedStore(
    (state) => state.selectedFeedType
  )
  const setSelectedFeedType = useMobileHomeFeedStore(
    (state) => state.setSelectedFeedType
  )

  return (
    <ScrollView
      style={styles.container}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 5 }}
    >
      <Pressable
        onPress={() => setSelectedFeedType(TimelineFeedType.CURATED)}
        style={[
          styles.filter,
          {
            backgroundColor:
              selectedFeedType === TimelineFeedType.CURATED
                ? themeConfig.buttonBackgroundColor
                : 'transparent'
          }
        ]}
      >
        <ExpoImage
          source={{
            uri: imageCdn(`${STATIC_ASSETS}/mobile/icons/in-love.png`, 'AVATAR')
          }}
          style={styles.image}
        />
        <Text
          style={[
            styles.text,
            {
              color:
                selectedFeedType === TimelineFeedType.CURATED
                  ? themeConfig.contrastTextColor
                  : themeConfig.textColor
            }
          ]}
        >
          Curated
        </Text>
      </Pressable>
      <Pressable
        onPress={() => {
          if (!selectedProfile) {
            return showToast({ text: 'Sign in with Lens' })
          }
          setSelectedFeedType(TimelineFeedType.FOLLOWING)
        }}
        style={[
          styles.filter,
          {
            backgroundColor:
              selectedFeedType === TimelineFeedType.FOLLOWING
                ? themeConfig.buttonBackgroundColor
                : 'transparent'
          }
        ]}
      >
        <ExpoImage
          source={{
            uri: imageCdn(`${STATIC_ASSETS}/mobile/icons/smile.png`, 'AVATAR')
          }}
          style={styles.image}
        />
        <Text
          style={[
            styles.text,
            {
              color:
                selectedFeedType === TimelineFeedType.FOLLOWING
                  ? themeConfig.contrastTextColor
                  : themeConfig.textColor
            }
          ]}
        >
          Following
        </Text>
      </Pressable>
      <Pressable
        onPress={() => {
          if (!selectedProfile) {
            return showToast({ text: 'Sign in with Lens' })
          }
          setSelectedFeedType(TimelineFeedType.HIGHLIGHTS)
        }}
        style={[
          styles.filter,
          {
            backgroundColor:
              selectedFeedType === TimelineFeedType.HIGHLIGHTS
                ? themeConfig.buttonBackgroundColor
                : 'transparent'
          }
        ]}
      >
        <ExpoImage
          source={{
            uri: imageCdn(`${STATIC_ASSETS}/mobile/icons/wow.png`, 'AVATAR')
          }}
          style={styles.image}
        />
        <Text
          style={[
            styles.text,
            {
              color:
                selectedFeedType === TimelineFeedType.HIGHLIGHTS
                  ? themeConfig.contrastTextColor
                  : themeConfig.textColor
            }
          ]}
        >
          Highlights
        </Text>
      </Pressable>
      <Pressable
        onPress={() => {
          navigate('FeedFlexModal')
        }}
        style={[
          styles.filter,
          {
            backgroundColor:
              selectedFeedType === TimelineFeedType.ALGORITHM
                ? themeConfig.buttonBackgroundColor
                : 'transparent'
          }
        ]}
      >
        <ExpoImage
          source={{
            uri: imageCdn(`${STATIC_ASSETS}/mobile/icons/proud.png`, 'AVATAR')
          }}
          style={styles.image}
        />
        <Text
          style={[
            styles.text,
            {
              color:
                selectedFeedType === TimelineFeedType.ALGORITHM
                  ? themeConfig.contrastTextColor
                  : themeConfig.textColor
            }
          ]}
        >
          Flex
        </Text>
        <Ionicons
          name="chevron-down-outline"
          color={
            selectedFeedType === TimelineFeedType.ALGORITHM
              ? themeConfig.contrastTextColor
              : themeConfig.textColor
          }
          size={15}
        />
      </Pressable>
    </ScrollView>
  )
}

export default TimelineFilters
