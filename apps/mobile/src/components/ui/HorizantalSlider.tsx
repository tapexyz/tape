import React from 'react'
import type { FlatListProps } from 'react-native'
import { FlatList } from 'react-native'

type Props<T> = Pick<FlatListProps<T>, 'data' | 'renderItem'>

export function HorizantalSlider<T>({ data, ...rest }: Props<T>) {
  return (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToAlignment="start"
      decelerationRate="fast"
      {...rest}
    />
  )
}
