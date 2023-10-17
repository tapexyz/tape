import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import getCurrentSessionId from '@lib/getCurrentSessionId'
import useAuthPersistStore from '@lib/store/auth'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@radix-ui/react-accordion'
import { Blockquote, Button } from '@radix-ui/themes'
import {
  LimitType,
  useApprovedAuthenticationQuery,
  useRevokeAuthenticationMutation
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const List = () => {
  const [revoking, setRevoking] = useState(false)
  const [revokingSessionId, setRevokingSessionId] = useState('')
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  const onError = (error: any) => {
    setRevoking(false)
    setRevokingSessionId('')
    toast.error(error)
  }

  const onCompleted = () => {
    setRevoking(false)
    setRevokingSessionId('')
    toast.success('Session revoked successfully!')
  }

  const { data, loading, error } = useApprovedAuthenticationQuery({
    variables: { request: { limit: LimitType.Fifty } },
    skip: !selectedSimpleProfile?.id
  })
  const sessions = data?.approvedAuthentication?.items

  const [revokeAuthentication] = useRevokeAuthenticationMutation({
    onCompleted,
    onError,
    update: (cache) => {
      cache.evict({ id: 'ROOT_QUERY' })
    }
  })

  if (loading) {
    return <Loader className="my-20" />
  }

  if (!sessions?.length || error) {
    return <NoDataFound withImage isCenter />
  }

  const revoke = async (authorizationId: string) => {
    try {
      setRevoking(true)
      setRevokingSessionId(authorizationId)

      return await revokeAuthentication({
        variables: { request: { authorizationId } }
      })
    } catch (error) {
      onError(error)
    }
  }

  return (
    <Accordion
      type="single"
      className="w-full space-y-3"
      defaultValue={sessions?.[0]?.authorizationId}
      collapsible
    >
      {sessions?.map((session) => {
        const currentSession = session.authorizationId === getCurrentSessionId()
        return (
          <AccordionItem
            className="bg-brand-50 dark:bg-brand-950/30 rounded-small group p-5"
            key={session.authorizationId}
            value={session.authorizationId}
          >
            <AccordionTrigger className="w-full text-left">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{session.origin}</p>
                  <span className="text-sm">{session.os}</span>
                </div>
                <ChevronDownOutline className="h-4 w-4 opacity-60 group-data-[state=open]:rotate-180" />
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-5">
              <div className="flex items-center justify-between">
                <Blockquote>
                  {session.browser}, created at {session.createdAt}
                </Blockquote>
                <Button
                  onClick={() => revoke(session.authorizationId)}
                  color="red"
                  disabled={
                    (revoking &&
                      revokingSessionId === session.authorizationId) ||
                    currentSession
                  }
                >
                  Revoke
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

export default List
