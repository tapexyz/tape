import { MotiView, Text, View } from 'moti'
import type { FC } from 'react'
import React, { memo, useEffect, useMemo, useRef } from 'react'
import type { StyleProp, TextStyle } from 'react-native'

const numZeroToNine = [...Array(10).keys()]

type TickProps = {
  number: number
  textSize: number
  index: number
  textStyle: StyleProp<TextStyle>
}

const Tick: FC<TickProps> = ({ number, textSize, textStyle, index }) => {
  const usePrevious = (value: number) => {
    const ref = useRef<number>()

    useEffect(() => {
      ref.current = value
    }, [value])
    return ref.current
  }

  const prev = usePrevious(number)
  return (
    <View style={{ height: textSize, overflow: 'hidden' }}>
      <View
        from={{ translateY: -textSize * (prev ?? 0) }}
        animate={{ translateY: -textSize * number }}
        transition={{
          type: 'timing',
          duration: 500,
          delay: 40 * index
        }}
      >
        {numZeroToNine.map((number, index) => {
          return (
            <Text
              key={index}
              style={[
                textStyle,
                {
                  height: textSize,
                  fontSize: textSize,
                  textAlign: 'center'
                }
              ]}
            >
              {number}
            </Text>
          )
        })}
      </View>
    </View>
  )
}

type TickerProps = {
  number: number
  textSize: number
  textStyle: StyleProp<TextStyle>
}

const Ticker: FC<TickerProps> = ({ number, textSize, textStyle }) => {
  const numArray = useMemo(() => String(number).split(''), [number])

  return (
    <MotiView style={{ flexDirection: 'row' }}>
      {numArray.map((num, index) => {
        return (
          <Tick
            key={index}
            index={index}
            textSize={textSize}
            textStyle={textStyle}
            number={parseFloat(num)}
          />
        )
      })}
    </MotiView>
  )
}

export default memo(Ticker)
