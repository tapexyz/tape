import Ionicons from '@expo/vector-icons/Ionicons'
import { type BottomSheetModal } from '@gorhom/bottom-sheet'
import { STATIC_ASSETS } from '@lenstube/constants'
import { imageCdn } from '@lenstube/generic'
import { useWalletConnectModal } from '@walletconnect/modal-react-native'
import { Image as ExpoImage } from 'expo-image'
import React, { useRef } from 'react'

import AnimatedPressable from '~/components/ui/AnimatedPressable'
import haptic from '~/helpers/haptic'
import { useMobileTheme } from '~/hooks'
import { signOut } from '~/store/persist'

import { useToast } from '../toast'
import AuthSheet from './AuthSheet'

const SignIn = () => {
  const { themeConfig } = useMobileTheme()
  const authSheetRef = useRef<BottomSheetModal>(null)

  const {
    open: openWalletConnectModal,
    address,
    provider
  } = useWalletConnectModal()
  const { showToast } = useToast()

  return (
    <>
      {address ? <AuthSheet sheetRef={authSheetRef} /> : null}

      <AnimatedPressable
        onLongPress={() => {
          haptic()
          showToast({ text: 'Disconnecting wallet...', variant: 'warn' })
          signOut()
          if (address) {
            provider?.disconnect()
          }
        }}
        onPress={() => {
          haptic()
          if (address) {
            return authSheetRef.current?.present()
          }
          openWalletConnectModal()
        }}
      >
        {address ? (
          <Ionicons
            name="log-in-outline"
            color={themeConfig.textColor}
            size={25}
          />
        ) : (
          <ExpoImage
            source={{
              uri: imageCdn(`${STATIC_ASSETS}/mobile/icons/herb.png`, 'AVATAR')
            }}
            contentFit="cover"
            transition={300}
            style={{ width: 23, height: 23, borderRadius: 8 }}
          />
        )}
      </AnimatedPressable>
    </>
  )
}

export default SignIn
