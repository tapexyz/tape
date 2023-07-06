import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import { STATIC_ASSETS } from '@lenstube/constants'
import {
  getRandomProfilePicture,
  imageCdn,
  logger,
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
import type { FC } from 'react'
import React from 'react'
import { Text, View } from 'react-native'
import { createWalletClient, custom } from 'viem'
import { polygon } from 'viem/chains'
import type { SignableMessage } from 'viem/dist/types/types/misc'

import AnimatedPressable from '~/components/ui/AnimatedPressable'
import Sheet from '~/components/ui/Sheet'
import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import useMobileStore from '~/store'
import { useMobilePersistStore } from '~/store/persist'

type Props = {
  sheetRef: React.RefObject<BottomSheetModalMethods>
}

const AuthSheet: FC<Props> = ({ sheetRef }) => {
  const setChannels = useMobileStore((state) => state.setChannels)
  const setSelectedChannel = useMobileStore((state) => state.setSelectedChannel)
  const { signIn: persistSignin } = useMobilePersistStore()
  const setSelectedChannelId = useMobilePersistStore(
    (state) => state.setSelectedChannelId
  )

  const { provider, address } = useWalletConnectModal()

  const [loadChallenge, { loading: challengeLoading }] = useChallengeLazyQuery({
    fetchPolicy: 'no-cache' // if cache old challenge persist issue (InvalidSignature)
  })
  const [authenticate, { loading: signingIn }] = useAuthenticateMutation()
  const [getChannels] = useAllProfilesLazyQuery({
    fetchPolicy: 'no-cache'
  })

  const signIn = async () => {
    if (!provider) {
      return
    }
    try {
      const challenge = await loadChallenge({
        variables: { request: { address } }
      })
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
      sheetRef.current?.close()
    } catch (error) {
      logger.error('SIGN IN ERROR 🔒', error)
    }
  }

  if (!address) {
    return null
  }

  return (
    <Sheet sheetRef={sheetRef}>
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
        <AnimatedPressable
          disabled={challengeLoading || signingIn}
          onPress={() => {
            haptic()
            signIn()
          }}
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
            Sign
          </Text>
        </AnimatedPressable>
      </View>
    </Sheet>
  )
}

export default AuthSheet
