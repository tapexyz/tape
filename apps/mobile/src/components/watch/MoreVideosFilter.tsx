import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 5
  },
  filter: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25
  },
  text: {
    fontFamily: 'font-bold',
    fontSize: normalizeFont(12),
    letterSpacing: 0.5
  }
})

const MoreVideosFilter = () => {
  return (
    <ScrollView
      style={styles.container}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    >
      <Pressable
        onPress={() => haptic()}
        style={[styles.filter, { backgroundColor: theme.colors.white }]}
      >
        <Text
          style={[
            styles.text,
            {
              color: theme.colors.black
            }
          ]}
        >
          Watch next
        </Text>
      </Pressable>
      <Pressable
        onPress={() => {
          haptic()
        }}
        style={styles.filter}
      >
        <Text
          style={[
            styles.text,
            {
              color: theme.colors.white
            }
          ]}
        >
          Related picks
        </Text>
      </Pressable>
      <Pressable
        onPress={() => {
          haptic()
        }}
        style={styles.filter}
      >
        <Text
          style={[
            styles.text,
            {
              color: theme.colors.white
            }
          ]}
        >
          From the Creator
        </Text>
      </Pressable>
    </ScrollView>
  )
}

export default MoreVideosFilter
