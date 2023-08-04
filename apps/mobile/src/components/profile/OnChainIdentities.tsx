import { STATIC_ASSETS } from '@lenstube/constants'
import { imageCdn } from '@lenstube/generic'
import type { OnChainIdentity } from '@lenstube/lens'
import { Image as ExpoImage } from 'expo-image'
import type { FC } from 'react'
import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import Animated, { FadeInRight } from 'react-native-reanimated'

import { theme } from '~/helpers/theme'

type Props = {
  identity: OnChainIdentity
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 100,
    backgroundColor: theme.colors.backdrop,
    marginRight: 10
  }
})

const OnChainIdentities: FC<Props> = ({ identity }) => {
  return (
    <Animated.View
      entering={FadeInRight.duration(500)}
      style={styles.container}
    >
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {identity?.ens?.name && (
          <ExpoImage
            source={{
              uri: imageCdn(`${STATIC_ASSETS}/mobile/images/products/ens.png`)
            }}
            transition={300}
            style={styles.image}
          />
        )}
        {identity?.worldcoin.isHuman && (
          <ExpoImage
            source={{
              uri: imageCdn(
                `${STATIC_ASSETS}/mobile/images/products/worldcoin.png`
              )
            }}
            transition={300}
            style={styles.image}
          />
        )}
        {identity?.proofOfHumanity && (
          <ExpoImage
            source={{
              uri: imageCdn(`${STATIC_ASSETS}/mobile/images/products/poh.png`)
            }}
            transition={300}
            style={styles.image}
          />
        )}
        {identity?.sybilDotOrg.verified && (
          <ExpoImage
            source={{
              uri: imageCdn(`${STATIC_ASSETS}/mobile/images/products/sybil.png`)
            }}
            transition={300}
            style={styles.image}
          />
        )}
      </ScrollView>
    </Animated.View>
  )
}

export default OnChainIdentities
