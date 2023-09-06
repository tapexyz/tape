import { Ionicons } from '@expo/vector-icons'
import type { FC, ReactNode } from 'react'
import React from 'react'
import type { TextStyle } from 'react-native'
import { Pressable, Text } from 'react-native'
import Animated, { FadeInUp } from 'react-native-reanimated'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

type Props = {
  active?: boolean
  setActive: (b: boolean) => void
  textStyle?: TextStyle
  text?: string
  content?: ReactNode
}

const Accordion: FC<Props> = ({
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
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 20
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
        <Ionicons
          name={active ? 'chevron-down-outline' : 'chevron-forward-outline'}
          color={themeConfig.textColor}
          size={20}
        />
      </Pressable>
      {active ? (
        <Animated.View style={{ flex: 1 }} entering={FadeInUp}>
          {content}
        </Animated.View>
      ) : null}
    </>
  )
}

export default Accordion
