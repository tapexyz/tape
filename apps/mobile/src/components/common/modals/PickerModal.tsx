import { PRIPE_APP_NAME } from '@lenstube/constants'
import { logger } from '@lenstube/generic'
import { PublicationMainFocus } from '@lenstube/lens'
import { Image as ExpoImage } from 'expo-image'
import * as MediaLibrary from 'expo-media-library'
import * as VideoThumbnails from 'expo-video-thumbnails'
import React, { useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native'

import PreviewRenderer from '~/components/new/PreviewRenderer'
import Button from '~/components/ui/Button'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import useMobilePublicationStore from '~/store/publication'

const styles = StyleSheet.create({
  listContainer: {
    justifyContent: 'center',
    backgroundColor: theme.colors.backdrop,
    flexGrow: 1
  },
  allowText: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(14),
    color: theme.colors.white
  }
})

const GRID_GAP = 3
const NUM_COLUMNS = 4

export const PickerModal = (props: PickerModalProps): JSX.Element => {
  const { mainFocus } = props.route.params

  const { height, width } = useWindowDimensions()
  const [permissionResponse] = MediaLibrary.usePermissions()

  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([])
  const [hasNextPage, setHasNextPage] = useState(true)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  const draftedPublication = useMobilePublicationStore(
    (state) => state.draftedPublication
  )
  const setDraftedPublication = useMobilePublicationStore(
    (state) => state.setDraftedPublication
  )

  const fetchMoreAssets = async () => {
    if (loading || !hasNextPage) {
      return
    }
    setLoading(true)
    try {
      const mediaType =
        mainFocus === PublicationMainFocus.Video
          ? [MediaLibrary.MediaType.video]
          : mainFocus === PublicationMainFocus.Audio
          ? [MediaLibrary.MediaType.audio]
          : [MediaLibrary.MediaType.photo]

      const { assets: newAssets, hasNextPage } =
        await MediaLibrary.getAssetsAsync({
          mediaType,
          first: 50,
          after: assets.length > 0 ? assets[assets.length - 1].id : undefined
        })
      const filtered = newAssets.filter((asset) => asset.duration <= 120) // 2minutes

      setHasNextPage(hasNextPage)
      setAssets((prevAssets) => [...prevAssets, ...filtered])
      setPage(page + 1)
    } catch (error) {
      logger.error('📱 Error Fetching Picker Assets', error)
    } finally {
      setLoading(false)
    }
  }

  const openAppSettings = () => {
    Linking.openSettings()
  }

  useEffect(() => {
    if (permissionResponse) {
      if (permissionResponse?.canAskAgain) {
        MediaLibrary.requestPermissionsAsync()
      }

      if (permissionResponse?.accessPrivileges !== 'none') {
        fetchMoreAssets()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionResponse])

  const renderAssetItem = ({
    item,
    index
  }: {
    item: MediaLibrary.Asset
    index: number
  }) => {
    return (
      <Pressable
        onPress={async () => {
          const asset = await MediaLibrary.getAssetInfoAsync(item.id)
          const { uri } = await VideoThumbnails.getThumbnailAsync(
            asset.localUri as string,
            {
              time: 0
            }
          )
          setDraftedPublication({ ...draftedPublication, asset, poster: uri })
        }}
      >
        <ExpoImage
          source={{ uri: item.uri }}
          transition={500}
          style={{
            marginRight: index % NUM_COLUMNS !== NUM_COLUMNS - 1 ? GRID_GAP : 0,
            marginBottom: GRID_GAP,
            width: (width - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS,
            height: (width - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS
          }}
        />
      </Pressable>
    )
  }

  const ListHeaderComponent = useMemo(() => {
    return (
      <View style={{ height: height / 2 }}>
        <PreviewRenderer />
      </View>
    )
  }, [height])

  return (
    <View style={styles.listContainer}>
      {!permissionResponse?.granted && !permissionResponse?.canAskAgain ? (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 30
          }}
        >
          <Text style={styles.allowText}>
            Allow {PRIPE_APP_NAME} to access your Photos
          </Text>
          <Button text="Open Settings" size="sm" onPress={openAppSettings} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={assets}
            ListHeaderComponent={ListHeaderComponent}
            renderItem={renderAssetItem}
            keyExtractor={(item) => item.id}
            numColumns={NUM_COLUMNS}
            onEndReached={fetchMoreAssets}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.8}
            ListFooterComponent={() =>
              loading && <ActivityIndicator style={{ paddingVertical: 30 }} />
            }
          />
        </View>
      )}
    </View>
  )
}
