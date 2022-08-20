import { useQuery } from '@apollo/client'
import MetaTags from '@components/Common/MetaTags'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { LENSTUBE_APP_ID } from '@utils/constants'
import {
  NOTIFICATION_COUNT_QUERY,
  NOTIFICATIONS_QUERY
} from '@utils/gql/queries'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import { Notification, PaginatedResultInfo } from 'src/types'

import CollectedNotification from './Collected'
import CommentedNotification from './Commented'
import MentionedNotification from './Mentioned'
import MirroredNotification from './Mirrored'
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

  const { data: notificationsCountData } = useQuery(NOTIFICATION_COUNT_QUERY, {
    variables: { request: { profileId: selectedChannel?.id } },
    skip: !selectedChannel?.id
  })
  const { data, loading, fetchMore } = useQuery(NOTIFICATIONS_QUERY, {
    variables: {
      request: {
        profileId: selectedChannel?.id,
        limit: 10,
        sources: [LENSTUBE_APP_ID]
      }
    },
    fetchPolicy: 'no-cache',
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
              sources: [LENSTUBE_APP_ID]
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

  if (loading)
    return (
      <span className="p-5">
        <Loader />
      </span>
    )

  if (data?.notifications?.items?.length === 0) return <NoDataFound />

  return (
    <div className="p-2 md:p-0">
      <MetaTags title="Notifications" />
      <h1 className="mb-4 text-lg font-medium md:hidden">Notifications</h1>
      {notifications?.map((notification: Notification, index: number) => (
        <div
          className={clsx('pb-3', {
            'pb-0': notifications.length - 1 === index
          })}
          key={notification.notificationId}
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
