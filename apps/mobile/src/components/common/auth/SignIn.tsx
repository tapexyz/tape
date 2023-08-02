import type { BottomSheetModal } from '@gorhom/bottom-sheet'
import { STATIC_ASSETS } from '@lenstube/constants'
import { imageCdn } from '@lenstube/generic'
import { useWalletConnectModal } from '@walletconnect/modal-react-native'
import { Image as ExpoImage } from 'expo-image'
import React, { useRef } from 'react'

import AnimatedPressable from '~/components/ui/AnimatedPressable'
import haptic from '~/helpers/haptic'

import AuthSheet from './AuthSheet'

const SignIn = () => {
  const authSheetRef = useRef<BottomSheetModal>(null)
  const { open, address } = useWalletConnectModal()

  return (
    <>
      {address && <AuthSheet sheetRef={authSheetRef} />}

      <AnimatedPressable
        onPress={() => {
          haptic()
          if (address) {
            return authSheetRef.current?.present()
          }
          open()
        }}
      >
        <ExpoImage
          source={{
            uri: imageCdn(`${STATIC_ASSETS}/mobile/icons/herb.png`, 'AVATAR')
          }}
          contentFit="cover"
          transition={300}
          style={{ width: 23, height: 23, borderRadius: 8 }}
        />
      </AnimatedPressable>
    </>
  )
}

export default SignIn
