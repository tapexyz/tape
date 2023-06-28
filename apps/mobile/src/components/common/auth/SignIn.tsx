import type { BottomSheetModal } from '@gorhom/bottom-sheet'
import { STATIC_ASSETS } from '@lenstube/constants'
import { getRandomProfilePicture, imageCdn } from '@lenstube/generic'
import { useWalletConnectModal } from '@walletconnect/modal-react-native'
import { Image as ExpoImage } from 'expo-image'
import { MotiPressable } from 'moti/interactions'
import React, { useEffect, useMemo, useRef } from 'react'

import haptic from '~/helpers/haptic'
import { useMobilePersistStore } from '~/store/persist'

import Sheet from './Sheet'

const SignIn = () => {
  const { open, address, isConnected } = useWalletConnectModal()
  const selectedChannelId = useMobilePersistStore(
    (state) => state.selectedChannelId
  )
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const pfp = address
    ? getRandomProfilePicture(address)
    : imageCdn(`${STATIC_ASSETS}/mobile/icons/herb.png`)

  const animatePress = useMemo(
    () =>
      ({ pressed }: { pressed: boolean }) => {
        'worklet'
        return {
          scale: pressed ? 0.98 : 1
        }
      },
    []
  )

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
      <MotiPressable
        onPress={() => {
          haptic()
          if (address) {
            return openSheet()
          }
          open()
        }}
        animate={animatePress}
      >
        <ExpoImage
          source={{ uri: pfp }}
          contentFit="cover"
          style={{ width: 23, height: 23, borderRadius: 8 }}
        />
      </MotiPressable>
    </>
  )
}

export default SignIn
