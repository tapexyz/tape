import { useQuery } from '@apollo/client'
import MetaTags from '@components/Common/MetaTags'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { LENSTUBE_APP_ID } from '@utils/constants'
import { NOTIFICATIONS_QUERY } from '@utils/gql/queries'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import { Notification, PaginatedResultInfo } from 'src/types'

const SubscribedNotification = dynamic(() => import('./Subscribed'))
const CommentedNotification = dynamic(() => import('./Commented'))
const MentionedNotification = dynamic(() => import('./Mentioned'))
const MirroredNotification = dynamic(() => import('./Mirrored'))
const CollectedNotification = dynamic(() => import('./Collected'))

const Notifications = () => {
  const { selectedChannel, setNotificationCount } = usePersistStore()
  const { setHasNewNotification } = useAppStore()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
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
        setNotificationCount(data?.notifications?.pageInfo?.totalCount)
        setHasNewNotification(false)
      }, 1000)
    }
  })

  const { observe } = useInView({
    threshold: 0.5,
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            profileId: selectedChannel?.id,
            cursor: pageInfo?.next,
            limit: 10,
            sources: [LENSTUBE_APP_ID]
          }
        }
      }).then(({ data }: any) => {
        setPageInfo(data?.notifications?.pageInfo)
        setNotifications([...notifications, ...data?.notifications?.items])
      })
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
          key={index}
        >
          {notification?.__typename === 'NewFollowerNotification' && (
            <SubscribedNotification notification={notification as any} />
          )}
          {notification?.__typename === 'NewCommentNotification' && (
            <CommentedNotification notification={notification as any} />
          )}
          {notification?.__typename === 'NewMentionNotification' && (
            <MentionedNotification notification={notification as any} />
          )}
          {notification?.__typename === 'NewMirrorNotification' && (
            <MirroredNotification notification={notification} />
          )}
          {notification?.__typename === 'NewCollectNotification' && (
            <CollectedNotification notification={notification as any} />
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
