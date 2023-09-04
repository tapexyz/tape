import { STATIC_ASSETS } from '@lenstube/constants'
import { imageCdn } from '@lenstube/generic'
import type { OnChainIdentity } from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { Image as ExpoImage } from 'expo-image'
import type { FC } from 'react'
import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

import { useToast } from '../common/toast'

type Props = {
  identity: OnChainIdentity
}

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    badge: {
      backgroundColor: themeConfig.backgroudColor,
      borderRadius: 100,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingRight: 10,
      paddingVertical: 1,
      borderColor: themeConfig.borderColor,
      borderWidth: 1
    },
    image: {
      width: 20,
      height: 20,
      borderRadius: 100,
      backgroundColor: themeConfig.backgroudColor2
    },
    text: {
      fontFamily: 'font-normal',
      fontSize: normalizeFont(10),
      color: themeConfig.textColor
    }
  })

const OnChainInfo: FC<Props> = ({ identity }) => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)
  const { showToast } = useToast()

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 10 }}
    >
      <Pressable style={[style.badge, { paddingLeft: 10 }]}>
        <Text style={style.text}>Bloomer since July 2022</Text>
      </Pressable>
      {identity?.ens?.name && (
        <View style={style.badge}>
          <ExpoImage
            source={{
              uri: imageCdn(
                `${STATIC_ASSETS}/mobile/images/products/ens.png`,
                'AVATAR'
              )
            }}
            transition={300}
            style={style.image}
          />
          <Text style={style.text}>{identity.ens.name}</Text>
        </View>
      )}
      {identity?.worldcoin.isHuman && (
        <Pressable
          style={style.badge}
          onPress={() => {
            haptic()
            showToast({ text: 'Worldcoin Verified' })
          }}
        >
          <ExpoImage
            source={{
              uri: imageCdn(
                `${STATIC_ASSETS}/mobile/images/products/worldcoin.png`,
                'AVATAR'
              )
            }}
            transition={300}
            style={style.image}
          />
          <Text style={style.text}>Person</Text>
        </Pressable>
      )}
      {identity?.proofOfHumanity && (
        <Pressable
          style={style.badge}
          onPress={() => {
            haptic()
            showToast({ text: 'Proof of Humanity Verified' })
          }}
        >
          <ExpoImage
            source={{
              uri: imageCdn(
                `${STATIC_ASSETS}/mobile/images/products/poh.png`,
                'AVATAR'
              )
            }}
            transition={300}
            style={style.image}
          />
          <Text style={style.text}>Human</Text>
        </Pressable>
      )}
      {identity?.sybilDotOrg.verified && (
        <Pressable
          style={style.badge}
          onPress={() => {
            haptic()
            showToast({ text: 'Twitter Verified' })
          }}
        >
          <ExpoImage
            source={{
              uri: imageCdn(
                `${STATIC_ASSETS}/mobile/images/products/sybil.png`,
                'AVATAR'
              )
            }}
            transition={300}
            style={style.image}
          />
          <Text style={style.text}>
            {identity?.sybilDotOrg.source.twitter.handle}
          </Text>
        </Pressable>
      )}
    </ScrollView>
  )
}

export default OnChainInfo
