import { LENS_CUSTOM_FILTERS, LENSTUBE_BYTES_APP_ID } from '@lenstube/constants'
import { getThumbnailUrl, imageCdn, trimify } from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { useNavigation } from '@react-navigation/native'
import { Image as ExpoImage } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Skeleton } from 'moti/skeleton'
import React from 'react'
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'
import useMobileStore from '~/store'
import { useMobilePersistStore } from '~/store/persist'

import UserProfile from '../common/UserProfile'
import HCarousel from '../ui/HCarousel'
import ServerError from '../ui/ServerError'

const CAROUSEL_HEIGHT = 210
const BORDER_RADIUS = 25

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    container: {
      paddingTop: 30,
      position: 'relative',
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center'
    },
    thumbnail: {
      width: '100%',
      height: CAROUSEL_HEIGHT,
      borderRadius: BORDER_RADIUS,
      borderColor: themeConfig.borderColor,
      borderWidth: 1
    },
    gradient: {
      alignSelf: 'center',
      position: 'absolute',
      top: 0,
      marginTop: 1,
      right: 1,
      left: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 15,
      paddingVertical: 12,
      opacity: 0.8,
      borderTopLeftRadius: BORDER_RADIUS,
      borderTopRightRadius: BORDER_RADIUS,
      zIndex: 2
    },
    otherInfo: {
      fontFamily: 'font-medium',
      fontSize: normalizeFont(10),
      color: themeConfig.textColor
    },
    title: {
      fontFamily: 'font-bold',
      color: themeConfig.textColor,
      fontSize: normalizeFont(10),
      width: '60%'
    }
  })

const PopularVideos = () => {
  const { navigate } = useNavigation()
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  const selectedProfile = useMobilePersistStore(
    (state) => state.selectedProfile
  )
  const homeGradientColor = useMobileStore((state) => state.homeGradientColor)

  const request = {
    publicationTypes: [PublicationTypes.Post],
    limit: 5,
    sortCriteria: PublicationSortCriteria.TopCollected,
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      mainContentFocus: [PublicationMainFocus.Audio, PublicationMainFocus.Video]
    }
  }

  const { data, loading, error } = useExploreQuery({
    variables: {
      request,
      channelId: selectedProfile?.id ?? null
    }
  })
  const publications = data?.explorePublications?.items as Publication[]

  if (error || !publications?.length) {
    return <ServerError />
  }

  return (
    <View style={style.container}>
      <Skeleton
        show={loading}
        colors={[`${homeGradientColor}10`, '#00000080']}
        radius={BORDER_RADIUS}
        height={CAROUSEL_HEIGHT}
      >
        <View>
          <HCarousel
            height={CAROUSEL_HEIGHT}
            borderRadius={BORDER_RADIUS}
            data={publications}
            renderItem={({ item }: { item: Publication }) => {
              const isBytes = item.appId === LENSTUBE_BYTES_APP_ID
              const thumbnailUrl = imageCdn(
                getThumbnailUrl(item, true),
                isBytes ? 'THUMBNAIL_V' : 'THUMBNAIL'
              )
              return (
                <Pressable
                  onPress={() => navigate('WatchScreen', { id: item.id })}
                >
                  <ImageBackground
                    source={{
                      uri: thumbnailUrl
                    }}
                    blurRadius={15}
                    style={{ position: 'relative' }}
                    imageStyle={{ opacity: 0.8, borderRadius: BORDER_RADIUS }}
                  >
                    <LinearGradient
                      colors={['#00000090', '#00000080', 'transparent']}
                      style={style.gradient}
                    >
                      <Text numberOfLines={1} style={style.title}>
                        {trimify(item.metadata.name ?? '')}
                      </Text>
                      <UserProfile
                        profile={item.profile}
                        size={15}
                        radius={3}
                      />
                    </LinearGradient>
                    <ExpoImage
                      source={{
                        uri: thumbnailUrl
                      }}
                      transition={300}
                      contentFit={isBytes ? 'contain' : 'cover'}
                      style={style.thumbnail}
                    />
                  </ImageBackground>
                </Pressable>
              )
            }}
          />
        </View>
      </Skeleton>
    </View>
  )
}

export default PopularVideos
