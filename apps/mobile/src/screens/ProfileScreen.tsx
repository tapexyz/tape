import type { Profile } from '@lenstube/lens'
import { useProfileQuery } from '@lenstube/lens'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, useWindowDimensions, View } from 'react-native'
import {
  useAnimatedScrollHandler,
  useSharedValue
} from 'react-native-reanimated'

import Info from '~/components/profile/Info'
import TabContent from '~/components/profile/TabContent'
import { useMobileTheme } from '~/hooks'
import { useMobilePersistStore } from '~/store/persist'

export const ProfileScreen = (
  props: ProfileScreenProps
): JSX.Element | null => {
  const { handle } = props.route.params
  const { goBack } = useNavigation()
  const { height } = useWindowDimensions()
  const contentScrollY = useSharedValue(0)
  const { themeConfig } = useMobileTheme()

  useEffect(() => {
    contentScrollY.value = 0
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle])

  const [infoHeaderHeight, setInfoHeaderHeight] = useState(0)

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const halfScreen = height / 2
      if (event.contentOffset.y < halfScreen) {
        contentScrollY.value = event.contentOffset.y
      }
    }
  })

  const selectedProfile = useMobilePersistStore(
    (state) => state.selectedProfile
  )

  const { data, loading } = useProfileQuery({
    variables: {
      request: { handle: handle?.replace('@', '') },
      who: selectedProfile?.id ?? null
    },
    skip: !handle
  })

  if (loading) {
    return (
      <ActivityIndicator
        style={{ flex: 1, backgroundColor: themeConfig.backgroudColor }}
      />
    )
  }

  if (!data?.profile) {
    goBack()
    return null
  }

  const profile = data.profile as Profile

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: themeConfig.backgroudColor
      }}
    >
      <Info
        profile={profile}
        contentScrollY={contentScrollY}
        infoHeaderHeight={infoHeaderHeight}
        setInfoHeaderHeight={setInfoHeaderHeight}
      />
      {Boolean(infoHeaderHeight) ? (
        <TabContent
          profile={profile}
          contentScrollY={contentScrollY}
          infoHeaderHeight={infoHeaderHeight}
          scrollHandler={scrollHandler}
        />
      ) : null}
    </View>
  )
}
