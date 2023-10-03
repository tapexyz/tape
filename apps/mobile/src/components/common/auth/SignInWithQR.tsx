import Ionicons from '@expo/vector-icons/Ionicons'
import type { BottomSheetModal } from '@gorhom/bottom-sheet'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import React, { useRef } from 'react'
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'

import AnimatedPressable from '~/components/ui/AnimatedPressable'
import Scanner from '~/components/ui/Scanner'
import Sheet from '~/components/ui/Sheet'
import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    text: {
      fontFamily: 'font-normal',
      fontSize: normalizeFont(13),
      color: themeConfig.textColor,
      textAlign: 'center'
    }
  })

const SignInWithQR = () => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)
  const scanSheetRef = useRef<BottomSheetModal>(null)
  const { height } = useWindowDimensions()

  return (
    <>
      <AnimatedPressable
        onPress={() => {
          haptic()
          scanSheetRef.current?.present()
        }}
      >
        <Ionicons
          name="log-in-outline"
          color={themeConfig.textColor}
          size={25}
        />
      </AnimatedPressable>
      <Sheet sheetRef={scanSheetRef}>
        <View
          style={{
            height: height * 0.4,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              width: height * 0.35,
              height: height * 0.35,
              borderRadius: 20,
              overflow: 'hidden'
            }}
          >
            <Scanner />
          </View>
        </View>

        <View
          style={{
            width: height * 0.35,
            paddingVertical: 20,
            alignSelf: 'center'
          }}
        >
          <Text style={style.text}>
            Open auth.lenstube.xyz and scan the QR after you sign in with lens
          </Text>
        </View>
      </Sheet>
    </>
  )
}

export default SignInWithQR
