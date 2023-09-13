import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import type { Notification, NotificationRequest } from '@lenstube/lens'
import { useNotificationsQuery } from '@lenstube/lens'
import { FlashList } from '@shopify/flash-list'
import React, { useCallback } from 'react'
import { ActivityIndicator, Text } from 'react-native'

import NotFound from '~/components/ui/NotFound'
import { useMobileTheme, usePushNotifications } from '~/hooks'
import { useMobilePersistStore } from '~/store/persist'

export const NotificationsModal = (): JSX.Element => {
  usePushNotifications()
  const { themeConfig } = useMobileTheme()

  const selectedProfile = useMobilePersistStore(
    (state) => state.selectedProfile
  )
  const request: NotificationRequest = {
    limit: 50,
    customFilters: LENS_CUSTOM_FILTERS,
    profileId: selectedProfile?.id
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
      data={notifications}
      renderItem={renderItem}
      estimatedItemSize={notifications.length}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, i) => `${item.notificationId}_${i}`}
      onEndReached={pageInfo?.next ? fetchMoreNotifications : null}
      onEndReachedThreshold={0.8}
      ListFooterComponent={() =>
        loading && <ActivityIndicator style={{ paddingVertical: 20 }} />
      }
      ListEmptyComponent={() => !loading && <NotFound />}
      onRefresh={() => refetch()}
      refreshing={Boolean(notifications?.length) && loading}
    />
  )
}
