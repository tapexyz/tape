import { PRIPE_APP_NAME } from '@lenstube/constants'
import Constants from 'expo-constants'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

const styles = StyleSheet.create({
  otherInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    padding: 5,
    opacity: 0.8
  },
  otherInfo: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(10),
    color: theme.colors.white
  }
})

const AppInfo = () => {
  const version = Constants.expoConfig?.version

  return (
    <View style={styles.otherInfoContainer}>
      <Text style={styles.otherInfo}>{PRIPE_APP_NAME}</Text>
      <Text style={{ color: theme.colors.secondary, fontSize: 3 }}>
        {'\u2B24'}
      </Text>
      <Text style={styles.otherInfo}>{version}</Text>
    </View>
  )
}

export default AppInfo
