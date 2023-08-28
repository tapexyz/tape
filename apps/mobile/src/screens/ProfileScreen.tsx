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
import { theme } from '~/helpers/theme'
import useMobileStore from '~/store'

export const ProfileScreen = (
  props: ProfileScreenProps
): JSX.Element | null => {
  const { handle } = props.route.params
  const { goBack } = useNavigation()
  const { height } = useWindowDimensions()
  const contentScrollY = useSharedValue(0)

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

  const selectedChannel = useMobileStore((state) => state.selectedChannel)

  const { data, loading } = useProfileQuery({
    variables: {
      request: { handle },
      who: selectedChannel?.id ?? null
    },
    skip: !handle
  })

  if (loading) {
    return (
      <ActivityIndicator
        style={{ flex: 1, backgroundColor: theme.colors.black }}
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
        backgroundColor: theme.colors.black
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
