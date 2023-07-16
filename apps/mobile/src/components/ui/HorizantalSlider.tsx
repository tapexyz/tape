import React from 'react'
import type { FlatListProps } from 'react-native'
import { FlatList, useWindowDimensions } from 'react-native'

type Props<T> = Pick<FlatListProps<T>, 'data' | 'renderItem'>

export function HorizantalSlider<T>({ data, ...rest }: Props<T>) {
  const { width } = useWindowDimensions()

  return (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToAlignment="start"
      decelerationRate="fast"
      snapToInterval={width / 1.5}
      {...rest}
    />
  )
}
