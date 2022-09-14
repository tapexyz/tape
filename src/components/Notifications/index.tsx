import { useQuery } from '@apollo/client'
import MetaTags from '@components/Common/MetaTags'
import NotificationsShimmer from '@components/Shimmers/NotificationsShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { NOTIFICATION_COUNT_QUERY, NOTIFICATIONS_QUERY } from '@gql/queries'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import {
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID
} from '@utils/constants'
import { Mixpanel, TRACK } from '@utils/track'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { Notification, PaginatedResultInfo } from 'src/types'

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
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  useEffect(() => {
    Mixpanel.track(TRACK.PAGE_VIEW.NOTIFICATIONS)
  }, [])

  const { data: notificationsCountData } = useQuery(NOTIFICATION_COUNT_QUERY, {
    variables: {
      request: {
        profileId: selectedChannel?.id,
        customFilters: LENS_CUSTOM_FILTERS
      }
    },
    skip: !selectedChannel?.id
  })
  const { data, loading, fetchMore } = useQuery(NOTIFICATIONS_QUERY, {
    variables: {
      request: {
        profileId: selectedChannel?.id,
        limit: 10,
        sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID],
        customFilters: LENS_CUSTOM_FILTERS
      }
    },
    onCompleted(data) {
      setPageInfo(data?.notifications?.pageInfo)
      setNotifications(data?.notifications?.items)
      setTimeout(() => {
        const totalCount =
          notificationsCountData?.notifications?.pageInfo?.totalCount
        setNotificationCount(totalCount ?? 0)
        setHasNewNotification(false)
      }, 1000)
    }
  })

  const { observe } = useInView({
    threshold: 0.5,
    onEnter: async () => {
      try {
        const { data } = await fetchMore({
          variables: {
            request: {
              profileId: selectedChannel?.id,
              cursor: pageInfo?.next,
              limit: 10,
              sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID],
              customFilters: LENS_CUSTOM_FILTERS
            }
          }
        })
        setPageInfo(data?.notifications?.pageInfo)
        setNotifications([...notifications, ...data?.notifications?.items])
      } catch (error) {
        logger.error('[Error Fetch Notifications]', error)
      }
    }
  })

  if (data?.notifications?.items?.length === 0) return <NoDataFound />

  return (
    <div className="mx-auto md:p-0 md:container md:max-w-2xl">
      <MetaTags title="Notifications" />
      <h1 className="mb-4 text-lg font-medium md:hidden">Notifications</h1>
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
