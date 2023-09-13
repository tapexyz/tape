import { trimLensHandle } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import { useAllProfilesQuery } from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { FlashList } from '@shopify/flash-list'
import React, { useCallback } from 'react'
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'
import { useMobilePersistStore } from '~/store/persist'

import UserProfile from '../common/UserProfile'
import NotFound from '../ui/NotFound'

const GRID_GAP = 10
const NUM_COLUMNS = 3
const HORIZONTAL_PADDING = 5

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    text: {
      fontFamily: 'font-medium',
      fontSize: normalizeFont(10),
      color: themeConfig.textColor
    }
  })

const Managed = () => {
  const { width } = useWindowDimensions()
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)
  const selectedProfile = useMobilePersistStore(
    (state) => state.selectedProfile
  )

  const { data, loading } = useAllProfilesQuery({
    variables: {
      request: {
        ownedBy: [selectedProfile?.ownedBy]
      }
    }
  })
  const profiles = data?.profiles?.items as Profile[]
  const availableWidth = width - HORIZONTAL_PADDING * 2

  const renderProfileItem = useCallback(
    ({ item, index }: { item: Profile; index: number }) => (
      <View
        style={{
          marginRight: index % NUM_COLUMNS !== NUM_COLUMNS - 1 ? GRID_GAP : 0,
          width: (availableWidth - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS,
          alignItems: 'center',
          gap: 10,
          padding: 10,
          borderRadius: 20
        }}
      >
        <UserProfile
          profile={item}
          imageStyle={{ width: 80, height: 80, borderRadius: 20 }}
          showHandle={false}
        />
        <Text style={style.text}>{trimLensHandle(item.handle)}</Text>
      </View>
    ),
    [availableWidth, style]
  )

  return (
    <FlashList
      data={profiles}
      renderItem={renderProfileItem}
      estimatedItemSize={profiles.length}
      keyExtractor={(item, i) => `${item.id}_${i}`}
      ItemSeparatorComponent={() => <View style={{ height: GRID_GAP }} />}
      ListEmptyComponent={() => !loading && <NotFound />}
      showsVerticalScrollIndicator={false}
      numColumns={NUM_COLUMNS}
    />
  )
}

export default Managed
