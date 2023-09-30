import { LENSTUBE_ADDRESS } from '@lenstube/constants'
import { getRandomProfilePicture, shortenAddress } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import { useAllProfilesQuery } from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { FlashList } from '@shopify/flash-list'
import { Image as ExpoImage } from 'expo-image'
import React, { useCallback, useState } from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'
import { useMobilePersistStore } from '~/store/persist'

import Accordion from '../ui/Accordion'
import NotFound from '../ui/NotFound'

const GRID_GAP = 10
const NUM_COLUMNS = 3
const HORIZONTAL_PADDING = 10

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    text: {
      fontFamily: 'font-medium',
      fontSize: normalizeFont(10),
      color: themeConfig.textColor
    },
    filter: {
      paddingHorizontal: 15,
      paddingVertical: 5,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: themeConfig.borderColor
    },
    filterText: {
      fontFamily: 'font-medium',
      fontSize: normalizeFont(12),
      color: themeConfig.textColor
    }
  })

const Addresses = () => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)
  const { width } = useWindowDimensions()

  const sampleAddresses = [
    '0xa8535b8049948bE1bFeb1404daEabbD407792411',
    LENSTUBE_ADDRESS,
    '0xA8C62111e4652b07110A0FC81816303c42632f64',
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
  ]
  const AVAILABLE_WIDTH = width - HORIZONTAL_PADDING * 2

  const renderItem = useCallback(
    ({ item, index }: { item: string; index: number }) => (
      <View
        style={{
          marginRight: index % NUM_COLUMNS !== NUM_COLUMNS - 1 ? GRID_GAP : 0,
          width: (AVAILABLE_WIDTH - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS,
          gap: 10,
          padding: 10,
          alignItems: 'center'
        }}
      >
        <ExpoImage
          source={{
            uri: getRandomProfilePicture(item)
          }}
          transition={300}
          contentFit="cover"
          style={{ width: 80, height: 80, borderRadius: 20 }}
        />
        <Text style={style.text}>{shortenAddress(item)}</Text>
      </View>
    ),
    [AVAILABLE_WIDTH, style]
  )

  return (
    <FlatList
      contentContainerStyle={{
        backgroundColor: themeConfig.backgroudColor2,
        borderRadius: 20,
        paddingVertical: 20
      }}
      data={sampleAddresses}
      renderItem={renderItem}
      numColumns={NUM_COLUMNS}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, i) => `${item}_${i}`}
      ItemSeparatorComponent={() => <View style={{ height: GRID_GAP }} />}
      ListEmptyComponent={<NotFound />}
    />
  )
}

const Item = ({ profile }: { profile: Profile }) => {
  const [active, setActive] = useState(false)
  return (
    <Accordion
      text={profile.handle}
      setActive={setActive}
      active={active}
      key={profile.id}
      content={<Addresses />}
    />
  )
}

const Managers = () => {
  const { width } = useWindowDimensions()

  const renderItem = useCallback(
    ({ item, index }: { item: Profile; index: number }) => (
      <Item profile={item} key={index} />
    ),
    []
  )

  const selectedProfile = useMobilePersistStore(
    (state) => state.selectedProfile
  )

  const { data } = useAllProfilesQuery({
    variables: {
      request: {
        ownedBy: [selectedProfile?.ownedBy]
      }
    }
  })
  const profiles = data?.profiles?.items as Profile[]

  return (
    <FlashList
      data={profiles}
      contentContainerStyle={{ paddingBottom: width }}
      renderItem={renderItem}
      estimatedItemSize={profiles?.length ?? 50}
      keyExtractor={(item, i) => `${item.id}_${i}`}
      showsVerticalScrollIndicator={false}
    />
  )
}

export default Managers
