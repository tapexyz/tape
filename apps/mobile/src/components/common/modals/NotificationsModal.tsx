import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import type { Notification, NotificationRequest } from '@lenstube/lens'
import { useNotificationsQuery } from '@lenstube/lens'
import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import React, { useCallback, useRef } from 'react'
import { ActivityIndicator, Text } from 'react-native'

import { useMobileTheme, usePushNotifications } from '~/hooks'
import useMobileStore from '~/store'

export const NotificationsModal = (): JSX.Element => {
  usePushNotifications()
  const { themeConfig } = useMobileTheme()

  const scrollRef = useRef<FlashList<Notification>>(null)
  //@ts-expect-error FlashList as type is not supported
  useScrollToTop(scrollRef)

  const selectedChannel = useMobileStore((state) => state.selectedChannel)

  const request: NotificationRequest = {
    limit: 50,
    customFilters: LENS_CUSTOM_FILTERS,
    profileId: selectedChannel?.id
  }

  const { data, loading, fetchMore, refetch } = useNotificationsQuery({
    variables: {
      request
    }
  })
  const notifications = data?.notifications?.items as Notification[]
  const pageInfo = data?.notifications?.pageInfo

  const fetchMoreNotifications = async () => {
    await fetchMore({
      variables: {
        request: {
          ...request,
          cursor: pageInfo?.next
        }
      }
    })
  }

  const renderItem = useCallback(
    ({ item }: { item: Notification }) => (
      <Text style={{ color: themeConfig.textColor }}>{item.__typename}</Text>
    ),
    [themeConfig]
  )

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />
  }

  return (
    <FlashList
      ref={scrollRef}
      data={notifications}
      renderItem={renderItem}
      estimatedItemSize={notifications.length}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, i) => `${item.notificationId}_${i}`}
      onEndReached={() => fetchMoreNotifications()}
      onEndReachedThreshold={0.8}
      ListFooterComponent={() => (
        <ActivityIndicator style={{ paddingVertical: 20 }} />
      )}
      onRefresh={() => refetch()}
      refreshing={Boolean(notifications?.length) && loading}
    />
  )
}
