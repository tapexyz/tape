import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import {
  getProfilePicture,
  getPublicationMediaUrl,
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
    marginRight: 6
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
  thumbnail: {
    borderRadius: BORDER_RADIUS,
    borderColor: theme.colors.secondary,
    borderWidth: 0.5
  }
})

const ImageCard = ({ publication }: { publication: Publication }) => {
  const { width } = useWindowDimensions()
  const imageUrl = imageCdn(getPublicationMediaUrl(publication))

  return (
    <View
      style={[
        styles.item,
        {
          width: width / 1.5
        }
      ]}
    >
      <ExpoImage
        source={{
          uri: imageUrl
        }}
        contentFit="cover"
        style={[
          styles.thumbnail,
          {
            width: '100%',
            height: width
          }
        ]}
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

const PopularImages = () => {
  const selectedChannel = useMobileStore((state) => state.selectedChannel)

  const request = {
    publicationTypes: [PublicationTypes.Post],
    limit: 15,
    sortCriteria: PublicationSortCriteria.TopCollected,
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      mainContentFocus: [PublicationMainFocus.Image]
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
    ({ item }: ListRenderItemInfo<Publication>) => (
      <ImageCard publication={item} />
    ),
    []
  )

  if (error) {
    return null
  }

  return (
    <View style={styles.container}>
      <HorizantalSlider data={publications} renderItem={renderItem} />
    </View>
  )
}

export default PopularImages
