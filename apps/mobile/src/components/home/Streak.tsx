import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import {
  getProfilePicture,
  getPublicationMediaUrl,
  getThumbnailUrl,
  imageCdn,
  trimLensHandle
} from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from '@lenstube/lens'
import { Image as ExpoImage } from 'expo-image'
import React, { useCallback } from 'react'
import type { ListRenderItemInfo } from 'react-native'
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import useMobileStore from '~/store'

import { HorizantalSlider } from '../ui/HorizantalSlider'

const BORDER_RADIUS = 25

const styles = StyleSheet.create({
  container: {
    paddingTop: 30
  },
  handle: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(12),
    color: theme.colors.white
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginRight: 3
  },
  itemProfile: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10
  },
  pfp: {
    width: 20,
    height: 20,
    borderRadius: 5
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
          width: isVideo ? width / 1.2 : 190
        }
      ]}
    >
      <ExpoImage
        source={{
          uri: imageUrl
        }}
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
      <View style={styles.itemProfile}>
        <ExpoImage
          source={{
            uri: imageCdn(getProfilePicture(publication.profile), 'AVATAR')
          }}
          contentFit="cover"
          style={styles.pfp}
        />
        <Text style={styles.handle}>
          {trimLensHandle(publication.profile.handle)}
        </Text>
      </View>
    </View>
  )
}

const Streak = () => {
  const selectedChannel = useMobileStore((state) => state.selectedChannel)

  const request = {
    publicationTypes: [PublicationTypes.Post],
    limit: 5,
    sortCriteria: PublicationSortCriteria.TopCollected,
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      mainContentFocus: [
        PublicationMainFocus.Image,
        PublicationMainFocus.Audio,
        PublicationMainFocus.Video
      ]
    }
  }

  const { data, error } = useExploreQuery({
    variables: {
      request,
      channelId: selectedChannel?.id ?? null
    }
  })
  const publications = data?.explorePublications?.items as Publication[]

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

  if (error) {
    return null
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lens Week & Streak</Text>
      <Text style={styles.subheading}>
        Your Collectibles, Your Story: Weekly Edition
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
