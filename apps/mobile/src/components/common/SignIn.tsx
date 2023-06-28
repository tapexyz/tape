import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet'
import { STATIC_ASSETS } from '@lenstube/constants'
import {
  getRandomProfilePicture,
  imageCdn,
  shortenAddress
} from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import {
  useAllProfilesLazyQuery,
  useAuthenticateMutation,
  useChallengeLazyQuery
} from '@lenstube/lens'
import { useWalletConnectModal } from '@walletconnect/modal-react-native'
import { Image as ExpoImage } from 'expo-image'
import { MotiPressable } from 'moti/interactions'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { Text, View } from 'react-native'
import { createWalletClient, custom } from 'viem'
import { polygon } from 'viem/chains'
import type { SignableMessage } from 'viem/dist/types/types/misc'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import useMobileStore from '~/store'
import { useMobilePersistStore } from '~/store/persist'

const SignIn = () => {
  const { signIn: persistSignin } = useMobilePersistStore()
  const setChannels = useMobileStore((state) => state.setChannels)
  const setSelectedChannel = useMobileStore((state) => state.setSelectedChannel)
  const setSelectedChannelId = useMobilePersistStore(
    (state) => state.setSelectedChannelId
  )

  const { open, provider, address, isConnected } = useWalletConnectModal()
  const [loadChallenge, { loading: challengeLoading }] = useChallengeLazyQuery({
    fetchPolicy: 'no-cache' // if cache old challenge persist issue (InvalidSignature)
  })
  const [authenticate, { loading: signingIn }] = useAuthenticateMutation()
  const [getChannels] = useAllProfilesLazyQuery({
    fetchPolicy: 'no-cache'
  })

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

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const openBottomSheet = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index)
  }, [])

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  )

  const snapPoints = useMemo(() => ['40%'], [])

  useEffect(() => {
    if (isConnected) {
      openBottomSheet()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected])

  const signIn = async () => {
    if (!provider) {
      return
    }
    try {
      const challenge = await loadChallenge({
        variables: { request: { address } }
      })
      console.log(
        '🚀 ~ file: Header.tsx:54 ~ signIn ~ challenge:',
        challenge?.data?.challenge?.text
      )
      const client = createWalletClient({
        chain: polygon,
        transport: custom(provider)
      })
      const signature = await client.signMessage({
        account: address as `0x${string}`,
        message: challenge?.data?.challenge?.text as SignableMessage
      })
      const { data } = await authenticate({
        variables: { request: { address, signature } }
      })
      const accessToken = data?.authenticate.accessToken
      const refreshToken = data?.authenticate.refreshToken
      persistSignin({ accessToken, refreshToken })
      const { data: channelsData } = await getChannels({
        variables: {
          request: { ownedBy: [address] }
        }
      })
      if (
        !channelsData?.profiles ||
        channelsData?.profiles?.items.length === 0
      ) {
        return persistSignin({ accessToken: null, refreshToken: null })
      }
      const channels = channelsData?.profiles?.items as Profile[]
      const defaultChannel = channels.find((channel) => channel.isDefault)
      setChannels(channels)
      setSelectedChannel(defaultChannel ?? channels[0])
      setSelectedChannelId(defaultChannel?.id ?? channels[0].id)
      bottomSheetModalRef.current?.close()
    } catch (error) {
      console.log('🚀 ~ signIn ~ error:', error)
    }
  }

  return (
    <>
      {address && (
        <BottomSheetModal
          index={0}
          ref={bottomSheetModalRef}
          backgroundStyle={{
            borderRadius: 40,
            backgroundColor: theme.colors.backdrop
          }}
          style={{ marginHorizontal: 10 }}
          bottomInset={20}
          detached={true}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backdropComponent={renderBackdrop}
        >
          <View
            style={{
              padding: 10,
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 15
            }}
          >
            <View
              style={{
                alignItems: 'center',
                flex: 1,
                justifyContent: 'space-between'
              }}
            >
              <ExpoImage
                source={{
                  uri: address
                    ? getRandomProfilePicture(address)
                    : imageCdn(`${STATIC_ASSETS}/mobile/icons/herb.png`)
                }}
                contentFit="cover"
                style={{ width: 70, height: 70, borderRadius: 25 }}
              />
              <Text
                style={{
                  color: theme.colors.white,
                  fontFamily: 'font-medium',
                  fontSize: normalizeFont(24)
                }}
              >
                {shortenAddress(address)}
              </Text>
              <Text
                style={{
                  color: theme.colors.secondary,
                  fontFamily: 'font-normal',
                  fontSize: normalizeFont(14)
                }}
              >
                Help us verify that you are the owner of the connected wallet by
                signing the message.
              </Text>
            </View>
            <MotiPressable
              disabled={challengeLoading || signingIn}
              onPress={() => {
                haptic()
                signIn()
              }}
              animate={animatePress}
              style={{
                backgroundColor: challengeLoading
                  ? theme.colors.secondary
                  : theme.colors.white,
                padding: 20,
                borderRadius: 100,
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  color: theme.colors.black,
                  fontFamily: 'font-medium',
                  fontSize: normalizeFont(18)
                }}
              >
                Sign in
              </Text>
            </MotiPressable>
          </View>
        </BottomSheetModal>
      )}
      <MotiPressable
        onPress={() => {
          haptic()
          if (address) {
            return openBottomSheet()
          }
          open()
        }}
        animate={animatePress}
      >
        <ExpoImage
          source={{
            uri: address
              ? getRandomProfilePicture(address)
              : imageCdn(`${STATIC_ASSETS}/mobile/icons/herb.png`)
          }}
          contentFit="cover"
          style={{ width: 23, height: 23, borderRadius: 8 }}
        />
      </MotiPressable>
    </>
  )
}

export default SignIn
