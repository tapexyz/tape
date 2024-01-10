import MetaTags from '@components/Common/MetaTags'
import NotificationsShimmer from '@components/Shimmers/NotificationsShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useNotificationStore from '@lib/store/notification'
import usePersistStore from '@lib/store/persist'
import {
  INFINITE_SCROLL_ROOT_MARGIN,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import { EVENTS, Tower } from '@tape.xyz/generic'
import type { Notification, NotificationRequest } from '@tape.xyz/lens'
import { useNotificationsQuery } from '@tape.xyz/lens'
import { CustomNotificationsFilterEnum } from '@tape.xyz/lens/custom-types'
import { Spinner } from '@tape.xyz/ui'
import React, { useEffect } from 'react'
import { useInView } from 'react-cool-inview'

import Acted from './Acted'
import Commented from './Commented'
import NotificationsFilter from './Filter'
import Followed from './Followed'
import Mentioned from './Mentioned'
import Mirrored from './Mirrored'
import Quoted from './Quoted'
import Reactions from './Reactions'

const Notifications = () => {
  const setHasNewNotification = useNotificationStore(
    (state) => state.setHasNewNotification
  )
  const selectedNotificationsFilter = usePersistStore(
    (state) => state.selectedNotificationsFilter
  )

  useEffect(() => {
    Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.NOTIFICATIONS })
  }, [])

  const request: NotificationRequest = {
    where: {
      customFilters: LENS_CUSTOM_FILTERS,
      highSignalFilter:
        selectedNotificationsFilter ===
        CustomNotificationsFilterEnum.HIGH_SIGNAL,
      publishedOn: [TAPE_APP_ID, LENSTUBE_BYTES_APP_ID, LENSTUBE_APP_ID]
    }
  }

  const { data, loading, fetchMore } = useNotificationsQuery({
    variables: {
      request
    },
    onCompleted: () => setHasNewNotification(false)
  })

  const notifications = data?.notifications?.items as Notification[]
  const pageInfo = data?.notifications?.pageInfo

  const { observe } = useInView({
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
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

  return (
    <div className="mx-auto my-2 px-2 md:container md:max-w-3xl md:p-0">
      <MetaTags title={`Notifications`} />
      <div className="mb-4 flex items-center justify-between font-bold md:mb-6">
        <span className="whitespace-nowrap text-xl">All Notifications</span>
        <NotificationsFilter />
      </div>
      <div>
        {loading && <NotificationsShimmer />}
        {notifications?.length === 0 && (
          <NoDataFound className="my-20" isCenter withImage />
        )}
        {notifications?.map((notification: Notification, index: number) => (
          <div className="pb-6" key={`${notification.id}_${index}`}>
            {notification?.__typename === 'MentionNotification' && (
              <Mentioned notification={notification} />
            )}
            {notification?.__typename === 'FollowNotification' && (
              <Followed notification={notification} />
            )}
            {notification?.__typename === 'MirrorNotification' && (
              <Mirrored notification={notification} />
            )}
            {notification?.__typename === 'QuoteNotification' && (
              <Quoted notification={notification} />
            )}
            {notification?.__typename === 'ActedNotification' && (
              <Acted notification={notification} />
            )}
            {notification?.__typename === 'CommentNotification' && (
              <Commented notification={notification} />
            )}
            {notification?.__typename === 'ReactionNotification' && (
              <Reactions notification={notification} />
            )}
          </div>
        ))}
        {pageInfo?.next && (
          <span ref={observe} className="flex justify-center p-10">
            <Spinner />
          </span>
        )}
      </div>
    </div>
  )
}

export default Notifications
