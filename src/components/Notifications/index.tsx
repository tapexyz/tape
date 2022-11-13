import MetaTags from '@components/Common/MetaTags'
import NotificationsShimmer from '@components/Shimmers/NotificationsShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import {
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  SCROLL_ROOT_MARGIN
} from '@utils/constants'
import clsx from 'clsx'
import React from 'react'
import { useInView } from 'react-cool-inview'
import type { Notification } from 'src/types/lens'
import { useNotificationCountQuery } from 'src/types/lens'
import { useNotificationsQuery } from 'src/types/lens'

import CollectedNotification from './Collected'
import CommentedNotification from './Commented'
import MentionedNotification from './Mentioned'
import MirroredNotification from './Mirrored'
import ReactedNotification from './Reacted'
import SubscribedNotification from './Subscribed'

const Notifications = () => {
  const setNotificationCount = usePersistStore(
    (state) => state.setNotificationCount
  )
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const setHasNewNotification = useAppStore(
    (state) => state.setHasNewNotification
  )

  const { data: notificationsCountData } = useNotificationCountQuery({
    variables: {
      request: {
        profileId: selectedChannel?.id,
        customFilters: LENS_CUSTOM_FILTERS
      }
    },
    skip: !selectedChannel?.id
  })

  const request = {
    limit: 30,
    sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID],
    customFilters: LENS_CUSTOM_FILTERS,
    profileId: selectedChannel?.id
  }

  const { data, loading, fetchMore } = useNotificationsQuery({
    variables: {
      request
    },
    onCompleted(data) {
      setTimeout(() => {
        const totalCount =
          notificationsCountData?.notifications?.pageInfo?.totalCount
        setNotificationCount(totalCount ?? 0)
        setHasNewNotification(false)
      }, 1000)
    }
  })

  const notifications = data?.notifications?.items as Notification[]
  const pageInfo = data?.notifications?.pageInfo

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            cursor: pageInfo?.next,
            ...request
          }
        }
      })
    }
  })

  if (notifications?.length === 0) return <NoDataFound />

  return (
    <div className="mx-auto md:p-0 md:container md:max-w-2xl">
      <MetaTags title="Notifications" />
      <h1 className="mb-4 text-lg font-semibold">Notifications</h1>
      {loading && <NotificationsShimmer />}
      {notifications?.map((notification: Notification, index: number) => (
        <div
          className={clsx('pb-3', {
            'pb-0': notifications.length - 1 === index
          })}
          key={`${notification.notificationId}_${index}`}
        >
          {notification?.__typename === 'NewFollowerNotification' && (
            <SubscribedNotification notification={notification} />
          )}
          {notification?.__typename === 'NewCommentNotification' && (
            <CommentedNotification notification={notification} />
          )}
          {notification?.__typename === 'NewMentionNotification' && (
            <MentionedNotification notification={notification} />
          )}
          {notification?.__typename === 'NewMirrorNotification' && (
            <MirroredNotification notification={notification} />
          )}
          {notification?.__typename === 'NewCollectNotification' && (
            <CollectedNotification notification={notification} />
          )}
          {notification?.__typename === 'NewReactionNotification' && (
            <ReactedNotification notification={notification} />
          )}
        </div>
      ))}
      {pageInfo?.next && (
        <span ref={observe} className="flex justify-center p-10">
          <Loader />
        </span>
      )}
    </div>
  )
}

export default Notifications
