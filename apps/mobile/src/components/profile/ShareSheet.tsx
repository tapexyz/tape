import Ionicons from '@expo/vector-icons/Ionicons'
import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import { LENSTUBE_LOGO, LENSTUBE_WEBSITE_URL } from '@lenstube/constants'
import {
  formatNumber,
  getProfilePicture,
  imageCdn,
  logger
} from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { Image as ExpoImage } from 'expo-image'
import * as Sharing from 'expo-sharing'
import type { FC } from 'react'
import React, { memo, useRef } from 'react'
import { Share, StyleSheet, Text, View } from 'react-native'
import { captureRef } from 'react-native-view-shot'

import AnimatedPressable from '~/components/ui/AnimatedPressable'
import Sheet from '~/components/ui/Sheet'
import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { colors } from '~/helpers/theme'
import { useMobileTheme } from '~/hooks'

import QRCode from '../ui/QRCode'

type Props = {
  sheetRef: React.RefObject<BottomSheetModalMethods>
  profile: Profile
}

const CARD_BORDER_RADIUS = 30

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    container: {
      padding: 10,
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 15
    },
    profileShareCard: {
      borderRadius: CARD_BORDER_RADIUS,
      backgroundColor: themeConfig.backgroudColor,
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 20,
      gap: 10,
      height: 210,
      borderColor: themeConfig.borderColor,
      borderWidth: 0.5
    },
    cardActions: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      paddingBottom: 9
    },
    hintText: {
      color: themeConfig.textColor,
      fontFamily: 'font-normal',
      fontSize: normalizeFont(8),
      textTransform: 'uppercase'
    },
    boldText: {
      color: themeConfig.textColor,
      fontFamily: 'font-bold',
      fontSize: normalizeFont(14),
      letterSpacing: 1
    },
    qrContainer: {
      padding: 10,
      backgroundColor: colors.white,
      alignSelf: 'flex-start',
      borderRadius: 20,
      borderColor: themeConfig.borderColor,
      borderWidth: 0.5
    }
  })

const ShareSheet: FC<Props> = ({ sheetRef, profile }) => {
  const profileCardRef = useRef<View>(null)
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  const shareAsPng = async () => {
    try {
      const uri = await captureRef(profileCardRef, {
        quality: 1,
        format: 'png'
      })
      Sharing.shareAsync(`file://${uri}`)
    } catch (error) {
      logger.error('📱 COPY PROFILE SHARE CARD AS PNG', error)
    }
  }

  return (
    <Sheet sheetRef={sheetRef} backdropOpacity={0.8}>
      <View style={style.container}>
        <View style={{ borderRadius: CARD_BORDER_RADIUS, overflow: 'hidden' }}>
          <View
            ref={profileCardRef}
            style={{ backgroundColor: themeConfig.backgroudColor }}
          >
            <View style={style.profileShareCard}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <View style={style.qrContainer}>
                  <QRCode
                    logo={getProfilePicture(profile)}
                    size={100}
                    value={`${LENSTUBE_WEBSITE_URL}/channel/${profile.handle}`}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 15
                  }}
                >
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={style.boldText}>
                      {formatNumber(profile.stats.totalFollowers)}
                    </Text>
                    <Text style={style.hintText}>followers</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={style.boldText}>
                      {formatNumber(profile.stats.totalPosts)}
                    </Text>
                    <Text style={style.hintText}>posts</Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <View>
                  <Text style={style.hintText}>Find me on Lens</Text>
                  <Text
                    style={{
                      color: themeConfig.textColor,
                      fontFamily: 'font-bold',
                      fontSize: normalizeFont(12)
                    }}
                  >
                    {profile.handle}
                  </Text>
                </View>
                <ExpoImage
                  source={{
                    uri: imageCdn(LENSTUBE_LOGO, 'AVATAR')
                  }}
                  contentFit="cover"
                  transition={500}
                  style={{
                    width: 30,
                    height: 30
                  }}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={style.cardActions}>
          <AnimatedPressable
            onPress={() => shareAsPng()}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
          >
            <Ionicons
              name="image-outline"
              color={themeConfig.textColor}
              size={15}
            />
            <Text
              style={{
                color: themeConfig.textColor,
                fontFamily: 'font-medium',
                fontSize: normalizeFont(10)
              }}
            >
              Share as image
            </Text>
          </AnimatedPressable>
          <AnimatedPressable
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            onPress={() => {
              haptic()
              Share.share({
                url: `${LENSTUBE_WEBSITE_URL}/channel/${profile.handle}`,
                message: `Checkout my Lens profile! 🌿 ${LENSTUBE_WEBSITE_URL}/channel/${profile.handle}`,
                title: `Checkout my Lens profile! 🌿 ${LENSTUBE_WEBSITE_URL}/channel/${profile.handle}`
              })
            }}
          >
            <Ionicons
              name="link-outline"
              color={themeConfig.textColor}
              size={20}
            />
            <Text
              style={{
                color: themeConfig.textColor,
                fontFamily: 'font-medium',
                fontSize: normalizeFont(10)
              }}
            >
              Share as link
            </Text>
          </AnimatedPressable>
        </View>
      </View>
    </Sheet>
  )
}

export default memo(ShareSheet)
