import Ionicons from '@expo/vector-icons/Ionicons'
import { getCategoryName } from '@lenstube/generic'
import { PublicationSortCriteria } from '@lenstube/lens'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import useMobileStore from '~/store'

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    marginHorizontal: 5
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
    borderColor: theme.colors.secondary
  },
  text: {
    fontFamily: 'font-bold',
    fontSize: normalizeFont(12),
    letterSpacing: 0.5,
    color: theme.colors.white
  }
})

const Filters = () => {
  const { navigate } = useNavigation()

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
      style={styles.container}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 10 }}
    >
      <Pressable
        onPress={() => {
          haptic()
          navigate('ExploreTopsModal')
        }}
        style={styles.filter}
      >
        <Text style={styles.text}>
          {getCriteriaTextLabel(selectedExploreFilter.criteria)}
        </Text>
        <Ionicons
          name="chevron-down-outline"
          color={theme.colors.white}
          size={15}
        />
      </Pressable>
      <Pressable
        onPress={() => {
          haptic()
          navigate('ExploreCategoriesModal')
        }}
        style={styles.filter}
      >
        <Text style={styles.text}>
          {getCategoryName(selectedExploreFilter.category ?? '') ?? 'Category'}
        </Text>
        <Ionicons
          name="chevron-down-outline"
          color={theme.colors.white}
          size={15}
        />
      </Pressable>
    </ScrollView>
  )
}

export default Filters
