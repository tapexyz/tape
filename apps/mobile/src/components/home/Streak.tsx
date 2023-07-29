import { LENS_CUSTOM_FILTERS, LENSTUBE_BYTES_APP_ID } from '@lenstube/constants'
import {
  getPublicationMediaUrl,
  getThumbnailUrl,
  imageCdn
} from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationTypes,
  useProfilePostsQuery
} from '@lenstube/lens'
import { Image as ExpoImage } from 'expo-image'
import React, { useCallback } from 'react'
import type { ListRenderItemInfo } from 'react-native'
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import useMobileStore from '~/store'

import { HorizantalSlider } from '../ui/HorizantalSlider'

const BORDER_RADIUS = 15

const styles = StyleSheet.create({
  container: {
    paddingTop: 30
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: 3,
    position: 'relative'
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
  }
})

const ImageCard = ({
  publication,
  index,
  last
}: {
  publication: Publication
  index: number
  last: number
}) => {
  const { width } = useWindowDimensions()
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
          width: isVideo ? (isBytes ? 120 : width / 1.2) : 190
        }
      ]}
    >
      <ExpoImage
        source={{
          uri: imageUrl
        }}
        transition={300}
        contentFit="cover"
        style={{
          width: '100%',
          height: 190,
          borderTopLeftRadius: index === 0 ? BORDER_RADIUS : 3,
          borderBottomLeftRadius: index === 0 ? BORDER_RADIUS : 3,
          borderTopRightRadius: index === last ? BORDER_RADIUS : 3,
          borderBottomRightRadius: index === last ? BORDER_RADIUS : 3
        }}
      />
    </View>
  )
}

const Streak = () => {
  const selectedChannel = useMobileStore((state) => state.selectedChannel)

  const request = {
    limit: 10,
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
      <ImageCard
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
      <View style={{ paddingTop: 20 }}>
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
