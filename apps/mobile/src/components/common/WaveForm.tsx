import { SB_STORAGE_URL } from '@lenstube/constants'
import { getPublicationMediaCid } from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import type { FC } from 'react'
import React, { useMemo } from 'react'
import { StyleSheet, useWindowDimensions, View } from 'react-native'
import useSWR from 'swr'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    title: {
      color: themeConfig.textColor,
      fontFamily: 'font-bold',
      fontSize: normalizeFont(13),
      letterSpacing: 0.5
    },
    sticks: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 5
    },
    stick: {
      width: 1,
      borderRadius: 10,
      backgroundColor: '#FF9729'
    }
  })

type Props = {
  audio: Publication
}

const WaveForm: FC<Props> = ({ audio }) => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)
  const { width } = useWindowDimensions()

  const { data: waves } = useSWR(
    `${SB_STORAGE_URL}/${getPublicationMediaCid(audio)}.json`,
    (url: string) => fetch(url).then((res) => res.json())
  )

  const samples = useMemo(() => waves?.samples as number[], [waves])

  return (
    <View style={{ height: 60, width, alignItems: 'center' }}>
      <View style={style.sticks}>
        {samples?.map((value, i) => (
          <View
            key={i}
            style={[
              style.stick,
              {
                height: value * 40
              }
            ]}
          />
        ))}
      </View>
      <View style={[style.sticks, { alignItems: 'flex-start' }]}>
        {samples?.map((value, i) => (
          <View
            key={i}
            style={[
              style.stick,
              {
                height: value * 20,
                backgroundColor: '#606060'
              }
            ]}
          />
        ))}
      </View>
    </View>
  )
}

export default WaveForm
