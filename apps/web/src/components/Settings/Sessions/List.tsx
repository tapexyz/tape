import { NoDataFound } from '@components/UIElements/NoDataFound'
import { getDateString } from '@lib/formatTime'
import useProfileStore from '@lib/store/idb/profile'
import { INFINITE_SCROLL_ROOT_MARGIN } from '@tape.xyz/constants'
import type { ApprovedAuthenticationRequest } from '@tape.xyz/lens'
import {
  LimitType,
  useApprovedAuthenticationsQuery,
  useRevokeAuthenticationMutation
} from '@tape.xyz/lens'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  ChevronDownOutline,
  Spinner
} from '@tape.xyz/ui'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import toast from 'react-hot-toast'

const List = () => {
  const [revokingSessionId, setRevokingSessionId] = useState('')
  const { activeProfile } = useProfileStore()

  const onError = (error: any) => {
    setRevokingSessionId('')
    toast.error(error)
  }

  const onCompleted = () => {
    setRevokingSessionId('')
    toast.success('Session revoked successfully!')
  }

  const request: ApprovedAuthenticationRequest = { limit: LimitType.Fifty }
  const { data, loading, error, fetchMore } = useApprovedAuthenticationsQuery({
    variables: { request },
    skip: !activeProfile?.id
  })
  const sessions = data?.approvedAuthentications?.items

  const pageInfo = data?.approvedAuthentications?.pageInfo

  const { observe } = useInView({
    threshold: 0.25,
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    }
  })

  const [revokeAuthentication] = useRevokeAuthenticationMutation({
    onCompleted,
    onError,
    update: (cache) => {
      cache.evict({ id: 'ROOT_QUERY' })
    }
  })

  if (loading) {
    return <Spinner className="my-20" />
  }

  if (!sessions?.length || error) {
    return <NoDataFound withImage isCenter />
  }

  const revoke = async (authorizationId: string) => {
    try {
      setRevokingSessionId(authorizationId)
      return await revokeAuthentication({
        variables: { request: { authorizationId } }
      })
    } catch (error) {
      onError(error)
    }
  }

  return (
    <Accordion type="single" className="w-full space-y-3" collapsible>
      {sessions?.map((session) => {
        return (
          <AccordionItem
            className="bg-brand-50 dark:bg-brand-950/30 rounded-small group p-5"
            key={session.authorizationId}
            value={session.authorizationId}
          >
            <AccordionTrigger className="w-full text-left">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-bold">{session.origin}</p>
                  </div>
                  <span className="text-sm">{session.os}</span>
                </div>
                <ChevronDownOutline className="size-4 opacity-60 group-data-[state=open]:rotate-180" />
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-5">
              <div className="flex items-center justify-between">
                <p>
                  {session.browser}, created at{' '}
                  {getDateString(session.createdAt)}
                </p>
                <Button
                  onClick={() => revoke(session.authorizationId)}
                  variant="danger"
                  disabled={revokingSessionId === session.authorizationId}
                  loading={revokingSessionId === session.authorizationId}
                >
                  Revoke
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
      {pageInfo?.next && (
        <span ref={observe} className="flex justify-center p-10">
          <Spinner />
        </span>
      )}
    </Accordion>
  )
}

export default List
