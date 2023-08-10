import type { FC } from 'react'
import React from 'react'
import type { TextStyle } from 'react-native'
import { Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

import Switch from './Switch'

type Props = {
  active?: boolean
  setActive: (b: boolean) => void
  textStyle?: TextStyle
  text?: string
}

const AccordionWithSwitch: FC<Props> = ({
  active = false,
  setActive,
  text = 'Enable',
  textStyle
}) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        paddingRight: 15
      }}
    >
      <Text
        style={[
          {
            fontSize: normalizeFont(15),
            paddingHorizontal: 12,
            color: theme.colors.grey,
            fontFamily: 'font-medium'
          },
          textStyle
        ]}
      >
        {text}
      </Text>
      <Switch isActive={active} onPress={() => setActive(!active)} />
    </View>
  )
}

export default AccordionWithSwitch
