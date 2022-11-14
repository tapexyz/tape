import BellOutline from '@components/Common/Icons/BellOutline'
import CommentOutline from '@components/Common/Icons/CommentOutline'
import LikeOutline from '@components/Common/Icons/LikeOutline'
import MentionOutline from '@components/Common/Icons/MentionOutline'
import SubscribeOutline from '@components/Common/Icons/SubscribeOutline'
import MetaTags from '@components/Common/MetaTags'
import NotificationsShimmer from '@components/Shimmers/NotificationsShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { Tab } from '@headlessui/react'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { Analytics, TRACK } from '@utils/analytics'
import {
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  SCROLL_ROOT_MARGIN
} from '@utils/constants'
import { formatNumber } from '@utils/functions/formatNumber'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import type { Notification } from 'src/types/lens'
import { NotificationTypes, useNotificationsQuery } from 'src/types/lens'

import CollectedNotification from './Collected'
import CommentedNotification from './Commented'
import MentionedNotification from './Mentioned'
import MirroredNotification from './Mirrored'
import ReactedNotification from './Reacted'
import SubscribedNotification from './Subscribed'

const initialFilters = {
  all: true,
  mentions: false,
  subscriptions: false,
  likes: false,
  comments: false
}

const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState(initialFilters)
  const setNotificationCount = usePersistStore(
    (state) => state.setNotificationCount
  )
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const setHasNewNotification = useAppStore(
    (state) => state.setHasNewNotification
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
      return [
        NotificationTypes.CommentedPost,
        NotificationTypes.CommentedComment
      ]
    }
  }

  const request = {
    limit: 30,
    sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID],
    customFilters: LENS_CUSTOM_FILTERS,
    profileId: selectedChannel?.id,
    notificationTypes: getNotificationFilters()
  }

  const { data, loading, fetchMore } = useNotificationsQuery({
    variables: {
      request
    },
    onCompleted: (data) => {
      if (data.notifications.pageInfo.__typename === 'PaginatedResultInfo') {
        const totalCount = data?.notifications?.pageInfo?.totalCount
        setTimeout(() => {
          setNotificationCount(totalCount ?? 0)
          setHasNewNotification(false)
        }, 1000)
      }
    }
  })

  const notifications = data?.notifications?.items as Notification[]
  const pageInfo = data?.notifications?.pageInfo
  const totalCount = data?.notifications?.pageInfo.totalCount

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
    <div className="mx-auto md:p-0 px-2 my-2 md:container md:max-w-2xl">
      <MetaTags title="Notifications" />
      <Tab.Group as="div" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <Tab.List className="flex w-full overflow-x-auto space-x-4 no-scrollbar">
            <Tab
              onClick={() => {
                setActiveFilter({ ...initialFilters })
                Analytics.track(TRACK.NOTIFICATIONS.CLICK_ALL)
              }}
              className={({ selected }) =>
                clsx(
                  'py-2 flex px-1 items-center space-x-2 border-b-2 text-sm focus:outline-none',
                  selected
                    ? 'border-indigo-900 opacity-100'
                    : 'border-transparent opacity-50'
                )
              }
            >
              <BellOutline className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">All Notifications</span>
            </Tab>
            <Tab
              onClick={() => {
                setActiveFilter({ ...initialFilters, subscriptions: true })
                Analytics.track(TRACK.NOTIFICATIONS.CLICK_SUBSCRIPTIONS)
              }}
              className={({ selected }) =>
                clsx(
                  'py-2 px-1 flex items-center space-x-2 border-b-2 text-sm focus:outline-none',
                  selected
                    ? 'border-indigo-900 opacity-100'
                    : 'border-transparent opacity-50'
                )
              }
            >
              <SubscribeOutline className="w-3.5 h-3.5" />
              <span>Subscriptions</span>
            </Tab>
            <Tab
              onClick={() => {
                setActiveFilter({ ...initialFilters, likes: true })
                Analytics.track(TRACK.NOTIFICATIONS.CLICK_LIKES)
              }}
              className={({ selected }) =>
                clsx(
                  'py-2 flex items-center space-x-2 border-b-2 text-sm focus:outline-none',
                  selected
                    ? 'border-indigo-900 opacity-100'
                    : 'border-transparent opacity-50'
                )
              }
            >
              <LikeOutline className="w-3.5 h-3.5" />
              <span>Likes</span>
            </Tab>
            <Tab
              onClick={() => {
                setActiveFilter({ ...initialFilters, comments: true })
                Analytics.track(TRACK.NOTIFICATIONS.CLICK_COMMENTS)
              }}
              className={({ selected }) =>
                clsx(
                  'py-2 flex px-1 items-center space-x-2 border-b-2 text-sm focus:outline-none',
                  selected
                    ? 'border-indigo-900 opacity-100'
                    : 'border-transparent opacity-50'
                )
              }
            >
              <CommentOutline className="w-3.5 h-3.5" />
              <span>Comments</span>
            </Tab>
            <Tab
              onClick={() => {
                setActiveFilter({ ...initialFilters, mentions: true })
                Analytics.track(TRACK.NOTIFICATIONS.CLICK_MENTIONS)
              }}
              className={({ selected }) =>
                clsx(
                  'py-2 flex px-1 items-center space-x-2 border-b-2 text-sm focus:outline-none',
                  selected
                    ? 'border-indigo-900 opacity-100'
                    : 'border-transparent opacity-50'
                )
              }
            >
              <MentionOutline className="w-3.5 h-3.5" />
              <span>Mentions</span>
            </Tab>
          </Tab.List>
          {totalCount && Boolean(totalCount) ? (
            <div className="text-right">
              <span className="text-xs opacity-50">
                ({formatNumber(totalCount)})
              </span>
            </div>
          ) : null}
        </div>
        <Tab.Panels>
          {loading && <NotificationsShimmer />}
          {notifications?.length === 0 && (
            <NoDataFound isCenter withImage text="No Notifications" />
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
