import type { Dispatch, FC } from 'react'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5
  },
  filter: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 25
  },
  filterText: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(12)
  },
  text: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(10)
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 5,
    paddingVertical: 10
  }
})

type Props = {
  showManagers: boolean
  setShowManagers: Dispatch<boolean>
}

const Filters: FC<Props> = ({ showManagers, setShowManagers }) => {
  const { themeConfig } = useMobileTheme()

  return (
    <View style={styles.filterContainer}>
      <Pressable
        onPress={() => setShowManagers(true)}
        style={[
          styles.filter,
          {
            backgroundColor: showManagers
              ? themeConfig.buttonBackgroundColor
              : 'transparent'
          }
        ]}
      >
        <Text
          style={[
            styles.filterText,
            {
              color: showManagers
                ? themeConfig.contrastTextColor
                : themeConfig.textColor
            }
          ]}
        >
          Managers
        </Text>
      </Pressable>
      <Pressable
        onPress={() => setShowManagers(false)}
        style={[
          styles.filter,
          {
            backgroundColor: !showManagers
              ? themeConfig.buttonBackgroundColor
              : 'transparent'
          }
        ]}
      >
        <Text
          style={[
            styles.filterText,
            {
              color: !showManagers
                ? themeConfig.contrastTextColor
                : themeConfig.textColor
            }
          ]}
        >
          Managed by you
        </Text>
      </Pressable>
    </View>
  )
}

export default Filters
