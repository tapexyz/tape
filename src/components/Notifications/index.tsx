import { useQuery } from '@apollo/client'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
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
  const { selectedChannel } = usePersistStore()
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
    <>
      {notifications?.map((notification: Notification, index: number) => (
        <div
          className={clsx('pb-2', {
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
    </>
  )
}

export default Notifications
