import React from 'react'
import type { FlatListProps } from 'react-native'
import { FlatList } from 'react-native'

type Props<T> = Pick<
  FlatListProps<T>,
  'data' | 'renderItem' | 'snapToAlignment' | 'decelerationRate'
>

export function HorizantalSlider<T>({
  data,
  snapToAlignment = 'start',
  decelerationRate = 'fast',
  ...rest
}: Props<T>) {
  return (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToAlignment={snapToAlignment}
      decelerationRate={decelerationRate}
      {...rest}
    />
  )
}
