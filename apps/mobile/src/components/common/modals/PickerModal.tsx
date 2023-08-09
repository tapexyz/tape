import { PRIPE_APP_NAME } from '@lenstube/constants'
import { logger } from '@lenstube/generic'
import { Image as ExpoImage } from 'expo-image'
import * as MediaLibrary from 'expo-media-library'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native'

import Button from '~/components/ui/Button'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

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

export const PickerModal = (): JSX.Element => {
  const { height, width } = useWindowDimensions()
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([])
  const [permissionResponse] = MediaLibrary.usePermissions()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  const fetchMoreAssets = async () => {
    if (loading) {
      return
    }
    setLoading(true)
    try {
      const { assets: newAssets } = await MediaLibrary.getAssetsAsync({
        mediaType: ['audio', 'video', 'photo'],
        first: 50,
        after: assets.length > 0 ? assets[assets.length - 1].id : undefined
      })

      setAssets((prevAssets) => [...prevAssets, ...newAssets])
      setPage(page + 1)
    } catch (error) {
      logger.error('📱 Error fetching Assets', error)
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
      <View style={{ margin: 0 }}>
        <ExpoImage
          source={{ uri: item.uri }}
          style={{
            marginRight: index % NUM_COLUMNS !== NUM_COLUMNS - 1 ? GRID_GAP : 0,
            marginBottom: GRID_GAP,
            width: (width - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS,
            height: (width - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS
          }}
        />
      </View>
    )
  }

  const Header = () => {
    return (
      <View style={{ height: height / 2, backgroundColor: 'red' }}>
        <Text style={styles.allowText}>Edit Here</Text>
      </View>
    )
  }

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
            ListHeaderComponent={Header}
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
