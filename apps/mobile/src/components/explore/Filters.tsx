import Ionicons from '@expo/vector-icons/Ionicons'
import { getCategoryName } from '@lenstube/generic'
import { PublicationSortCriteria } from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'
import useMobileStore from '~/store'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    container: {
      marginVertical: 20
    },
    filter: {
      paddingHorizontal: 15,
      paddingVertical: 7,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: themeConfig.borderColor
    },
    text: {
      fontFamily: 'font-bold',
      fontSize: normalizeFont(12),
      letterSpacing: 0.5,
      color: themeConfig.textColor
    }
  })

const Filters = () => {
  const { navigate } = useNavigation()
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  const selectedExploreFilter = useMobileStore(
    (state) => state.selectedExploreFilter
  )

  const getCriteriaTextLabel = (criteria: PublicationSortCriteria) => {
    switch (criteria) {
      case PublicationSortCriteria.TopCollected:
        return 'Top Collected'
      case PublicationSortCriteria.TopCommented:
        return 'Top Commented'
      case PublicationSortCriteria.TopMirrored:
        return 'Top Mirrored'
    }
  }

  return (
    <ScrollView
      style={style.container}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 10 }}
    >
      <Pressable
        onPress={() => {
          haptic()
          navigate('ExploreTopsModal')
        }}
        style={style.filter}
      >
        <Text style={style.text}>
          {getCriteriaTextLabel(selectedExploreFilter.criteria)}
        </Text>
        <Ionicons
          name="chevron-down-outline"
          color={themeConfig.textColor}
          size={15}
        />
      </Pressable>
      <Pressable
        onPress={() => {
          haptic()
          navigate('ExploreCategoriesModal')
        }}
        style={style.filter}
      >
        <Text style={style.text}>
          {getCategoryName(selectedExploreFilter.category ?? '') ?? 'Category'}
        </Text>
        <Ionicons
          name="chevron-down-outline"
          color={themeConfig.textColor}
          size={15}
        />
      </Pressable>
    </ScrollView>
  )
}

export default Filters
