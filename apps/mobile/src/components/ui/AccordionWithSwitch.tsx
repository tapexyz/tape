import type { FC, ReactNode } from 'react'
import React from 'react'
import type { TextStyle } from 'react-native'
import { Pressable, Text } from 'react-native'
import Animated, { FadeInUp } from 'react-native-reanimated'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

import Switch from './Switch'

type Props = {
  active?: boolean
  setActive: (b: boolean) => void
  textStyle?: TextStyle
  text?: string
  content?: ReactNode
}

const AccordionWithSwitch: FC<Props> = ({
  active = false,
  setActive,
  text = 'Enable',
  textStyle,
  content
}) => {
  const { themeConfig } = useMobileTheme()

  return (
    <>
      <Pressable
        onPress={() => setActive(!active)}
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 20,
          paddingRight: 5
        }}
      >
        <Text
          style={[
            {
              fontSize: normalizeFont(15),
              color: themeConfig.secondaryTextColor,
              fontFamily: 'font-medium'
            },
            textStyle
          ]}
        >
          {text}
        </Text>
        <Switch isActive={active} onPress={() => setActive(!active)} />
      </Pressable>
      {active ? (
        <Animated.View entering={FadeInUp}>{content}</Animated.View>
      ) : null}
    </>
  )
}

export default AccordionWithSwitch
