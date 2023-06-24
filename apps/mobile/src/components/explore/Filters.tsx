import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native'

import { theme } from '../../constants/theme'
import haptic from '../../helpers/haptic'
import normalizeFont from '../../helpers/normalize-font'

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 10
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
    borderColor: theme.colors.secondary,
    marginRight: 10
  },
  text: {
    fontFamily: 'font-bold',
    fontSize: normalizeFont(12),
    letterSpacing: 0.5
  }
})

const Filters = () => {
  const { navigate } = useNavigation()
  return (
    <ScrollView
      style={styles.container}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    >
      <Pressable
        onPress={() => haptic()}
        style={[styles.filter, { backgroundColor: '#ffffff70' }]}
      >
        <Text style={[styles.text, { color: theme.colors.black }]}>All</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          haptic()
          navigate('ExploreTopsModal')
        }}
        style={styles.filter}
      >
        <Text style={[styles.text, { color: theme.colors.white }]}>
          Top Tens
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
        <Text style={[styles.text, { color: theme.colors.white }]}>
          Categories
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
