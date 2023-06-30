import type { BottomSheetModal } from '@gorhom/bottom-sheet'
import { STATIC_ASSETS } from '@lenstube/constants'
import { getProfilePicture, imageCdn } from '@lenstube/generic'
import { useWalletConnectModal } from '@walletconnect/modal-react-native'
import { Image as ExpoImage } from 'expo-image'
import React, { useEffect, useRef } from 'react'

import AnimatedPressable from '~/components/ui/AnimatedPressable'
import haptic from '~/helpers/haptic'
import useMobileStore from '~/store'
import { useMobilePersistStore } from '~/store/persist'

import Sheet from './Sheet'

const SignIn = () => {
  const { open, address, isConnected } = useWalletConnectModal()
  const selectedChannelId = useMobilePersistStore(
    (state) => state.selectedChannelId
  )
  const selectedChannel = useMobileStore((state) => state.selectedChannel)

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const pfp = selectedChannel
    ? getProfilePicture(selectedChannel)
    : imageCdn(`${STATIC_ASSETS}/mobile/icons/herb.png`)

  const openSheet = () => {
    bottomSheetModalRef.current?.present()
  }

  useEffect(() => {
    if (isConnected && !selectedChannelId) {
      openSheet()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected])

  return (
    <>
      {address && <Sheet sheetRef={bottomSheetModalRef} />}

      <AnimatedPressable
        onPress={() => {
          haptic()
          if (address) {
            return openSheet()
          }
          open()
        }}
      >
        <ExpoImage
          source={{ uri: pfp }}
          contentFit="cover"
          style={{ width: 23, height: 23, borderRadius: 8 }}
        />
      </AnimatedPressable>
    </>
  )
}

export default SignIn
