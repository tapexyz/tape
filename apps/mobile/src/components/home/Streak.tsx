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
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { useNavigation } from '@react-navigation/native'
import { Image as ExpoImage } from 'expo-image'
import type { FC } from 'react'
import React, { memo, useCallback, useMemo } from 'react'
import type { ListRenderItemInfo } from 'react-native'
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Text,
  View
} from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { colors } from '~/helpers/theme'
import { useMobileTheme } from '~/hooks'
import { useMobilePersistStore } from '~/store/persist'

import AnimatedPressable from '../ui/AnimatedPressable'
import { HorizantalSlider } from '../ui/HorizantalSlider'

const BORDER_RADIUS = 10

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    container: {
      paddingTop: 30
    },
    item: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      height: 120,
      borderColor: themeConfig.borderColor,
      borderWidth: 1,
      borderRightWidth: 0,
      overflow: 'hidden'
    },
    title: {
      fontFamily: 'font-bold',
      color: themeConfig.textColor,
      fontSize: normalizeFont(14)
    },
    subheading: {
      fontFamily: 'font-normal',
      color: themeConfig.secondaryTextColor,
      fontSize: normalizeFont(12)
    },
    created: {
      position: 'absolute',
      bottom: 7,
      right: 7,
      borderRadius: 5,
      paddingHorizontal: 5,
      paddingVertical: 3,
      backgroundColor: themeConfig.backgroudColor
    },
    text: {
      fontFamily: 'font-medium',
      fontSize: normalizeFont(7),
      color: themeConfig.textColor
    },
    add: {
      backgroundColor: themeConfig.backgroudColor3,
      width: 50,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderTopLeftRadius: BORDER_RADIUS,
      borderBottomLeftRadius: BORDER_RADIUS,
      borderColor: themeConfig.borderColor,
      borderWidth: 1,
      borderRightWidth: 0
    },
    trueItem: {
      backgroundColor: colors.green,
      flex: 1,
      height: 5,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10
    },
    falseItem: {
      backgroundColor: colors.lightRed,
      flex: 1,
      height: 5,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10
    },
    streakContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 9,
      gap: 4
    }
  })

type Props = {
  publication: Publication
  index: number
  last: number
}

const PublicationItem: FC<Props> = ({ publication, index, last }) => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

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
        style.item,
        {
          aspectRatio: isVideo ? (isBytes ? 9 / 16 : 16 / 9) : 1 / 1,
          borderRightWidth: index === last ? 1 : 0,
          borderTopRightRadius: index === last ? BORDER_RADIUS : 0,
          borderBottomRightRadius: index === last ? BORDER_RADIUS : 0
        }
      ]}
    >
      <ImageBackground
        source={{ uri: imageUrl }}
        blurRadius={15}
        style={StyleSheet.absoluteFillObject}
        imageStyle={{
          opacity: 0.5
        }}
      >
        <ExpoImage
          source={{
            uri: imageUrl
          }}
          transition={300}
          contentFit={isVideo ? 'cover' : 'contain'}
          style={StyleSheet.absoluteFillObject}
        />
      </ImageBackground>
      <View style={style.created}>
        <Text style={style.text}>
          {getShortHandTime(publication.createdAt)}
        </Text>
      </View>
    </View>
  )
}

const Streak = () => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)
  const { navigate } = useNavigation()
  const selectedProfile = useMobilePersistStore(
    (state) => state.selectedProfile
  )

  const request: PublicationsQueryRequest = {
    limit: 50,
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      mainContentFocus: [
        PublicationMainFocus.Image,
        PublicationMainFocus.Audio,
        PublicationMainFocus.Video
      ]
    },
    publicationTypes: [PublicationTypes.Post],
    profileId: selectedProfile?.id
  }

  const { data, error, loading } = useProfilePostsQuery({
    variables: {
      request,
      channelId: selectedProfile?.id ?? null
    },
    skip: !selectedProfile?.id
  })

  const publications = data?.publications?.items as Publication[]

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<Publication>) => (
      <PublicationItem publication={item} index={index} last={6} />
    ),
    []
  )

  const renderStreakItem = useCallback(
    (item: boolean, index: number) => (
      <View key={index} style={item ? style.trueItem : style.falseItem} />
    ),
    [style.trueItem, style.falseItem]
  )

  const calculateStreak = useCallback((publications: Publication[]) => {
    const streakArray: boolean[] = []

    if (!publications?.length) {
      return streakArray
    }
    const postDates = publications
      .slice(0, 7)
      .map((publication) => publication.createdAt.split('T')[0])
    const today = new Date()
    const seventhDay = new Date(today)
    seventhDay.setDate(today.getDate() - 6)

    for (let day = today; day >= seventhDay; day.setDate(day.getDate() - 1)) {
      const targetDate = day.toISOString().split('T')[0]
      if (postDates.includes(targetDate)) {
        streakArray.push(true)
      } else {
        streakArray.push(false)
      }
    }
    return streakArray
  }, [])

  const streaks = useMemo(
    () => calculateStreak(publications),
    [publications, calculateStreak]
  )

  if (error || !selectedProfile) {
    return null
  }

  return (
    <View style={style.container}>
      <Text style={style.title}>Lens Week & Streak</Text>
      <Text style={style.subheading}>
        Your Collectibles, Your Story: Weekly
      </Text>
      <View style={{ paddingTop: 20 }}>
        {loading ? (
          <ActivityIndicator
            style={{
              height: 120,
              alignSelf: 'center',
              borderRadius: BORDER_RADIUS
            }}
          />
        ) : (
          <>
            {streaks?.length ? (
              <View style={style.streakContainer}>
                {streaks.map((item, i) => renderStreakItem(item, i))}
              </View>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center'
              }}
            >
              <AnimatedPressable
                onPress={() => navigate('NewPublication')}
                style={style.add}
              >
                <Ionicons
                  name="add-outline"
                  color={themeConfig.textColor}
                  style={{ paddingLeft: 1 }}
                  size={20}
                />
              </AnimatedPressable>
              <HorizantalSlider
                data={publications?.slice(0, 7)}
                renderItem={renderItem}
                decelerationRate="normal"
              />
            </View>
          </>
        )}
      </View>
    </View>
  )
}

export default memo(Streak)
