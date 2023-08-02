import type { Profile } from '@lenstube/lens'
import { useProfileQuery } from '@lenstube/lens'
import React from 'react'
import { ActivityIndicator, View } from 'react-native'

import Info from '~/components/profile/Info'
import { theme } from '~/helpers/theme'
import useMobileStore from '~/store'

export const ProfileModal = (props: ProfileModalProps): JSX.Element => {
  const { handle } = props.route.params
  const selectedChannel = useMobileStore((state) => state.selectedChannel)

  const { data, loading } = useProfileQuery({
    variables: {
      request: { handle },
      who: selectedChannel?.id ?? null
    },
    skip: !handle
  })

  if (loading || !data?.profile) {
    return (
      <ActivityIndicator
        style={{ flex: 1, backgroundColor: theme.colors.black }}
      />
    )
  }

  const profile = data.profile as Profile

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.black
      }}
    >
      <Info profile={profile} />
    </View>
  )
}
