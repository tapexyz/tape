import Ionicons from '@expo/vector-icons/Ionicons'
import { LENS_CUSTOM_FILTERS, LENSTUBE_BYTES_APP_ID } from '@lenstube/constants'
import {
  getPublicationMediaUrl,
  getShortHandTime,
  getThumbnailUrl,
  imageCdn
} from '@lenstube/generic'
import type { Publication, PublicationsQueryRequest } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationTypes,
  useProfilePostsQuery
} from '@lenstube/lens'
import { useNavigation } from '@react-navigation/native'
import { Image as ExpoImage } from 'expo-image'
import React, { useCallback } from 'react'
import type { ListRenderItemInfo } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import useMobileStore from '~/store'

import AnimatedPressable from '../ui/AnimatedPressable'
import { HorizantalSlider } from '../ui/HorizantalSlider'

const BORDER_RADIUS = 10

const styles = StyleSheet.create({
  container: {
    paddingTop: 30
  },
  item: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    marginRight: 3,
    height: 120
  },
  title: {
    fontFamily: 'font-bold',
    color: theme.colors.white,
    fontSize: normalizeFont(14)
  },
  subheading: {
    fontFamily: 'font-normal',
    color: theme.colors.secondary,
    fontSize: normalizeFont(12)
  },
  created: {
    position: 'absolute',
    bottom: 7,
    right: 7,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    backgroundColor: theme.colors.black
  },
  text: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(7),
    color: theme.colors.white
  },
  add: {
    backgroundColor: theme.colors.backdrop,
    width: 50,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: BORDER_RADIUS,
    borderBottomLeftRadius: BORDER_RADIUS
  }
})

const StreakItem = ({
  publication,
  index,
  last
}: {
  publication: Publication
  index: number
  last: number
}) => {
  const isVideo =
    publication.metadata.mainContentFocus === PublicationMainFocus.Video
  const isBytes = publication.appId === LENSTUBE_BYTES_APP_ID
  const isImage =
    publication.metadata.mainContentFocus === PublicationMainFocus.Image
  const imageUrl = imageCdn(
    isImage ? getPublicationMediaUrl(publication) : getThumbnailUrl(publication)
  )

  return (
    <View
      style={[
        styles.item,
        {
          aspectRatio: isVideo ? (isBytes ? 9 / 16 : 16 / 9) : 1 / 1
        }
      ]}
    >
      <ExpoImage
        source={{
          uri: imageUrl
        }}
        transition={300}
        contentFit="cover"
        style={[
          {
            borderTopRightRadius: index === last ? BORDER_RADIUS : 3,
            borderBottomRightRadius: index === last ? BORDER_RADIUS : 3
          },
          StyleSheet.absoluteFillObject
        ]}
      />
      <View style={styles.created}>
        <Text style={styles.text}>
          {getShortHandTime(publication.createdAt)}
        </Text>
      </View>
    </View>
  )
}

const Streak = () => {
  const { navigate } = useNavigation()
  const selectedChannel = useMobileStore((state) => state.selectedChannel)

  const request: PublicationsQueryRequest = {
    limit: 7,
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      mainContentFocus: [
        PublicationMainFocus.Image,
        PublicationMainFocus.Audio,
        PublicationMainFocus.Video
      ]
    },
    publicationTypes: [PublicationTypes.Post],
    profileId: selectedChannel?.id
  }

  const { data, error } = useProfilePostsQuery({
    variables: {
      request,
      channelId: selectedChannel?.id ?? null
    },
    skip: !selectedChannel?.id
  })

  const publications = data?.publications?.items as Publication[]

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<Publication>) => (
      <StreakItem
        publication={item}
        index={index}
        last={publications.length - 1}
      />
    ),
    [publications?.length]
  )

  if (error || !selectedChannel) {
    return null
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lens Week & Streak</Text>
      <Text style={styles.subheading}>
        Your Collectibles, Your Story: Weekly
      </Text>
      <View style={{ paddingTop: 20, flexDirection: 'row', gap: 3 }}>
        <AnimatedPressable
          onPress={() => navigate('NewPublication')}
          style={styles.add}
        >
          <Ionicons
            name="add-outline"
            color={theme.colors.white}
            style={{ paddingLeft: 1 }}
            size={20}
          />
        </AnimatedPressable>
        <HorizantalSlider
          data={publications}
          renderItem={renderItem}
          decelerationRate="normal"
        />
      </View>
    </View>
  )
}

export default Streak
