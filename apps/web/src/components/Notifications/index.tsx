import BellOutline from '@components/Common/Icons/BellOutline'
import CollectOutline from '@components/Common/Icons/CollectOutline'
import CommentOutline from '@components/Common/Icons/CommentOutline'
import LikeOutline from '@components/Common/Icons/LikeOutline'
import MentionOutline from '@components/Common/Icons/MentionOutline'
import SubscribeOutline from '@components/Common/Icons/SubscribeOutline'
import MetaTags from '@components/Common/MetaTags'
import NotificationsShimmer from '@components/Shimmers/NotificationsShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { Tab } from '@headlessui/react'
import useChannelStore from '@lib/store/channel'
import usePersistStore from '@lib/store/persist'
import { t, Trans } from '@lingui/macro'
import clsx from 'clsx'
import type { Notification } from 'lens'
import { NotificationTypes, useNotificationsQuery } from 'lens'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import {
  Analytics,
  CustomNotificationsFilterEnum,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  SCROLL_ROOT_MARGIN,
  TRACK
} from 'utils'

import CollectedNotification from './Collected'
import CommentedNotification from './Commented'
import NotificationsFilter from './Filter'
import MentionedNotification from './Mentioned'
import MirroredNotification from './Mirrored'
import ReactedNotification from './Reacted'
import SubscribedNotification from './Subscribed'

const initialFilters = {
  all: false,
  mentions: false,
  subscriptions: false,
  likes: false,
  comments: false,
  collects: false
}

const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState(initialFilters)
  const selectedChannel = useChannelStore((state) => state.selectedChannel)
  const setHasNewNotification = useChannelStore(
    (state) => state.setHasNewNotification
  )
  const selectedNotificationsFilter = usePersistStore(
    (state) => state.selectedNotificationsFilter
  )

  const getNotificationFilters = () => {
    if (activeFilter.mentions) {
      return [NotificationTypes.MentionPost, NotificationTypes.MentionComment]
    }
    if (activeFilter.subscriptions) {
      return [NotificationTypes.Followed]
    }
    if (activeFilter.likes) {
      return [NotificationTypes.ReactionPost, NotificationTypes.ReactionComment]
    }
    if (activeFilter.comments) {
      return [NotificationTypes.CommentedPost]
    }
    if (activeFilter.collects) {
      return [
        NotificationTypes.CollectedPost,
        NotificationTypes.CollectedComment
      ]
    }
    return [
      NotificationTypes.CollectedPost,
      NotificationTypes.CommentedPost,
      NotificationTypes.Followed,
      NotificationTypes.MentionComment,
      NotificationTypes.MentionPost,
      NotificationTypes.ReactionComment,
      NotificationTypes.ReactionPost
    ]
  }

  const request = {
    limit: 30,
    sources: activeFilter.subscriptions
      ? undefined
      : [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID],
    customFilters: LENS_CUSTOM_FILTERS,
    profileId: selectedChannel?.id,
    highSignalFilter:
      selectedNotificationsFilter === CustomNotificationsFilterEnum.HIGH_SIGNAL,
    notificationTypes: getNotificationFilters()
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
        <div className="mb-4 flex items-center justify-between">
          <Tab.List className="no-scrollbar flex w-full space-x-4 overflow-x-auto pr-4">
            <Tab
              onClick={() => {
                setActiveFilter({ ...initialFilters })
                Analytics.track(TRACK.NOTIFICATIONS.SWITCH_NOTIFICATION_TAB, {
                  notification_type: 'all'
                })
              }}
              className={({ selected }) =>
                clsx(
                  'flex items-center space-x-2 border-b-2 px-1 py-2 text-sm focus:outline-none',
                  selected
                    ? 'border-indigo-900 opacity-100'
                    : 'border-transparent opacity-50'
                )
              }
            >
              <BellOutline className="h-3.5 w-3.5" />
              <span className="whitespace-nowrap">
                <Trans>All Notifications</Trans>
              </span>
            </Tab>
            <Tab
              onClick={() => {
                setActiveFilter({ ...initialFilters, subscriptions: true })
                Analytics.track(TRACK.NOTIFICATIONS.SWITCH_NOTIFICATION_TAB, {
                  notification_type: 'subscriptions'
                })
              }}
              className={({ selected }) =>
                clsx(
                  'flex items-center space-x-2 border-b-2 px-1 py-2 text-sm focus:outline-none',
                  selected
                    ? 'border-indigo-900 opacity-100'
                    : 'border-transparent opacity-50'
                )
              }
            >
              <SubscribeOutline className="h-3.5 w-3.5" />
              <span>
                <Trans>Subscriptions</Trans>
              </span>
            </Tab>
            <Tab
              onClick={() => {
                setActiveFilter({ ...initialFilters, likes: true })
                Analytics.track(TRACK.NOTIFICATIONS.SWITCH_NOTIFICATION_TAB, {
                  notification_type: 'likes'
                })
              }}
              className={({ selected }) =>
                clsx(
                  'flex items-center space-x-2 whitespace-nowrap border-b-2 py-2 text-sm focus:outline-none',
                  selected
                    ? 'border-indigo-900 opacity-100'
                    : 'border-transparent opacity-50'
                )
              }
            >
              <LikeOutline className="h-3.5 w-3.5" />
              <span>
                <Trans>Likes</Trans>
              </span>
            </Tab>
            <Tab
              onClick={() => {
                setActiveFilter({ ...initialFilters, comments: true })
                Analytics.track(TRACK.NOTIFICATIONS.SWITCH_NOTIFICATION_TAB, {
                  notification_type: 'comments'
                })
              }}
              className={({ selected }) =>
                clsx(
                  'flex items-center space-x-2 border-b-2 px-1 py-2 text-sm focus:outline-none',
                  selected
                    ? 'border-indigo-900 opacity-100'
                    : 'border-transparent opacity-50'
                )
              }
            >
              <CommentOutline className="h-3.5 w-3.5" />
              <span>
                <Trans>Comments</Trans>
              </span>
            </Tab>
            <Tab
              onClick={() => {
                setActiveFilter({ ...initialFilters, mentions: true })
                Analytics.track(TRACK.NOTIFICATIONS.SWITCH_NOTIFICATION_TAB, {
                  notification_type: 'mentions'
                })
              }}
              className={({ selected }) =>
                clsx(
                  'flex items-center space-x-2 border-b-2 px-1 py-2 text-sm focus:outline-none',
                  selected
                    ? 'border-indigo-900 opacity-100'
                    : 'border-transparent opacity-50'
                )
              }
            >
              <MentionOutline className="h-3.5 w-3.5" />
              <span>
                <Trans>Mentions</Trans>
              </span>
            </Tab>
            <Tab
              onClick={() => {
                setActiveFilter({ ...initialFilters, collects: true })
                Analytics.track(TRACK.NOTIFICATIONS.SWITCH_NOTIFICATION_TAB, {
                  notification_type: 'collects'
                })
              }}
              className={({ selected }) =>
                clsx(
                  'flex items-center space-x-2 border-b-2 px-1 py-2 text-sm focus:outline-none',
                  selected
                    ? 'border-indigo-900 opacity-100'
                    : 'border-transparent opacity-50'
                )
              }
            >
              <CollectOutline className="h-3.5 w-3.5" />
              <span>
                <Trans>Collects</Trans>
              </span>
            </Tab>
          </Tab.List>
          <NotificationsFilter />
        </div>
        <Tab.Panels>
          {loading && <NotificationsShimmer />}
          {notifications?.length === 0 && (
            <NoDataFound isCenter withImage text={t`No Notifications`} />
          )}
          {notifications?.map((notification: Notification, index: number) => (
            <div
              className="pb-3"
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
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

export default Notifications
