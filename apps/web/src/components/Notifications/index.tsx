import MetaTags from '@components/Common/MetaTags'
import NotificationsShimmer from '@components/Shimmers/NotificationsShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { Tab } from '@headlessui/react'
import usePersistStore from '@lib/store/persist'
import useProfileStore from '@lib/store/profile'
import { t, Trans } from '@lingui/macro'
import {
  IS_MAINNET,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_BYTES_APP_ID,
  SCROLL_ROOT_MARGIN,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import type { Notification, NotificationRequest } from '@tape.xyz/lens'
import { NotificationType, useNotificationsQuery } from '@tape.xyz/lens'
import { CustomNotificationsFilterEnum } from '@tape.xyz/lens/custom-types'
import { Loader } from '@tape.xyz/ui'
import React from 'react'
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
  const setHasNewNotification = useProfileStore(
    (state) => state.setHasNewNotification
  )
  const selectedNotificationsFilter = usePersistStore(
    (state) => state.selectedNotificationsFilter
  )

  const request: NotificationRequest = {
    where: {
      customFilters: LENS_CUSTOM_FILTERS,
      highSignalFilter:
        selectedNotificationsFilter ===
        CustomNotificationsFilterEnum.HIGH_SIGNAL,
      notificationTypes: [
        NotificationType.Acted,
        NotificationType.Commented,
        NotificationType.Followed,
        NotificationType.Mentioned,
        NotificationType.Reacted,
        NotificationType.Mirrored,
        NotificationType.Quoted
      ],
      publishedOn: IS_MAINNET ? [TAPE_APP_ID, LENSTUBE_BYTES_APP_ID] : undefined
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

  return (
    <div className="mx-auto my-2 px-2 md:container md:max-w-3xl md:p-0">
      <MetaTags title={t`Notifications`} />
      <Tab.Group as="div" className="w-full">
        <div className="mb-4 flex items-end justify-between font-semibold md:mb-6">
          <span className="whitespace-nowrap">
            <Trans>All Notifications</Trans>
          </span>
          <NotificationsFilter />
        </div>
        <Tab.Panels>
          {loading && <NotificationsShimmer />}
          {notifications?.length === 0 && (
            <NoDataFound isCenter withImage text={t`No Notifications`} />
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
              <Loader />
            </span>
          )}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

export default Notifications
