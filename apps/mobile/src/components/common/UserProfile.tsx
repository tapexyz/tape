import { getProfilePicture, trimLensHandle } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { useNavigation } from '@react-navigation/native'
import type { ImageStyle } from 'expo-image'
import { Image as ExpoImage } from 'expo-image'
import type { FC } from 'react'
import React, { memo } from 'react'
import type { StyleProp, TextStyle } from 'react-native'
import { StyleSheet, Text } from 'react-native'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

import AnimatedPressable from '../ui/AnimatedPressable'

type Props = {
  profile: Profile
  size?: number
  radius?: number
  showHandle?: boolean
  pressable?: boolean
  opacity?: number
  onPress?: () => void
  handleStyle?: StyleProp<TextStyle>
  imageStyle?: ImageStyle
}

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    pressable: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6
    },
    handle: {
      fontFamily: 'font-normal',
      fontSize: normalizeFont(10),
      color: themeConfig.textColor
    }
  })

const UserProfile: FC<Props> = (props) => {
  const {
    profile,
    size = 25,
    radius = 8,
    opacity = 1,
    onPress,
    showHandle = true,
    handleStyle,
    pressable,
    imageStyle = {}
  } = props
  const { navigate } = useNavigation()
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  const navigateToProfile = () => {
    haptic()
    navigate('ProfileScreen', {
      handle: profile.handle
    })
  }

  return (
    <AnimatedPressable
      pressable={pressable}
      style={[style.pressable, { opacity }]}
      onPress={onPress ?? navigateToProfile}
    >
      <ExpoImage
        source={{
          uri: getProfilePicture(profile)
        }}
        contentFit="cover"
        transition={500}
        style={[
          {
            width: size,
            height: size,
            borderRadius: radius,
            borderWidth: 0.5,
            borderColor: themeConfig.borderColor,
            backgroundColor: themeConfig.backgroudColor2
          },
          imageStyle
        ]}
      />
      {showHandle && (
        <Text numberOfLines={1} style={[style.handle, handleStyle]}>
          {trimLensHandle(profile.handle)}
        </Text>
      )}
    </AnimatedPressable>
  )
}

export default memo(UserProfile)
