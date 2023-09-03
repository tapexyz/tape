import Ionicons from '@expo/vector-icons/Ionicons'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import type { BarCodeEvent } from 'expo-barcode-scanner'
import { BarCodeScanner } from 'expo-barcode-scanner'
import * as Linking from 'expo-linking'
import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

import AnimatedPressable from './AnimatedPressable'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    container: {
      flex: 1
    },
    text: {
      fontSize: normalizeFont(12),
      color: themeConfig.textColor,
      fontFamily: 'font-normal',
      textAlign: 'center'
    }
  })

const Scanner = () => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  const [hasPermission, setHasPermission] = useState(false)
  const [scanned, setScanned] = useState(false)

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    }

    getBarCodeScannerPermissions()
  }, [])

  const handleBarCodeScanned = ({ type, data }: BarCodeEvent) => {
    setScanned(true)
    console.log(`Bar code with type ${type} and data ${data} has been scanned!`)
  }

  if (hasPermission === null) {
    return (
      <AnimatedPressable
        onPress={() => Linking.openSettings()}
        style={{ padding: 10, alignItems: 'center', gap: 20 }}
      >
        <Ionicons name="body-outline" color={themeConfig.textColor} size={25} />
        <Text style={style.text}>Requesting for camera permission</Text>
      </AnimatedPressable>
    )
  }

  if (hasPermission === false) {
    return (
      <AnimatedPressable
        onPress={() => Linking.openSettings()}
        style={{ padding: 10, alignItems: 'center', gap: 20 }}
      >
        <Ionicons
          name="camera-outline"
          color={themeConfig.textColor}
          size={25}
        />
        <Text style={style.text}>
          Need your camera's blessing, Open settings?
        </Text>
      </AnimatedPressable>
    )
  }

  return (
    <View style={style.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Pressable onPress={() => setScanned(false)}>
          <Text style={style.text}>Tap to Scan Again</Text>
        </Pressable>
      )}
    </View>
  )
}

export default Scanner
