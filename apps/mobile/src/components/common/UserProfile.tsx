import { getProfilePicture, trimLensHandle } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import { useNavigation } from '@react-navigation/native'
import { Image as ExpoImage } from 'expo-image'
import type { FC } from 'react'
import React, { memo } from 'react'
import type { StyleProp, TextStyle } from 'react-native'
import { StyleSheet, Text } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

import AnimatedPressable from '../ui/AnimatedPressable'

type Props = {
  profile: Profile
  size?: number
  radius?: number
  showHandle?: boolean
  opacity?: number
  onPress?: () => void
  handleStyle?: StyleProp<TextStyle>
}

const styles = StyleSheet.create({
  pressable: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  handle: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(10),
    color: theme.colors.white
  }
})

const UserProfile: FC<Props> = ({
  profile,
  size = 25,
  radius = 8,
  opacity = 1,
  onPress,
  showHandle = true,
  handleStyle
}) => {
  const { navigate } = useNavigation()

  const navigateToProfile = () => {
    navigate('ProfileModal', {
      handle: profile.handle
    })
  }

  return (
    <AnimatedPressable
      style={[styles.pressable, { opacity }]}
      onPress={onPress ?? navigateToProfile}
    >
      <ExpoImage
        source={{
          uri: getProfilePicture(profile)
        }}
        contentFit="cover"
        transition={500}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          borderWidth: 0.5,
          borderColor: theme.colors.secondary
        }}
      />
      {showHandle && (
        <Text numberOfLines={1} style={[styles.handle, handleStyle]}>
          {trimLensHandle(profile.handle)}
        </Text>
      )}
    </AnimatedPressable>
  )
}

export default memo(UserProfile)
