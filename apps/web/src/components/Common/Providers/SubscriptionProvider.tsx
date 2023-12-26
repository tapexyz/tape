import getCurrentSession from '@lib/getCurrentSession'
import { signOut } from '@lib/store/auth'
import useNonceStore from '@lib/store/nonce'
import usePersistStore from '@lib/store/persist'
import { LENS_API_URL } from '@tape.xyz/constants'
import type { Notification, UserSigNonces } from '@tape.xyz/lens'
import {
  AuthorizationRecordRevokedSubscriptionDocument,
  NewNotificationSubscriptionDocument,
  UserSigNoncesSubscriptionDocument
} from '@tape.xyz/lens'
import { useApolloClient } from '@tape.xyz/lens/apollo'
import { useEffect } from 'react'
import useWebSocket from 'react-use-websocket'
import { isAddress } from 'viem'
import { useAccount } from 'wagmi'

const SubscriptionProvider = () => {
  const { address } = useAccount()
  const { setLensHubOnchainSigNonce } = useNonceStore()
  const { resetStore: resetApolloStore } = useApolloClient()
  const currentSession = getCurrentSession()

  const setLatestNotificationId = usePersistStore(
    (state) => state.setLatestNotificationId
  )

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    LENS_API_URL.replace('http', 'ws'),
    { protocols: ['graphql-transport-ws'] }
  )

  useEffect(() => {
    sendJsonMessage({ type: 'connection_init' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (readyState === 1 && currentSession?.profileId) {
      if (!isAddress(currentSession.profileId)) {
        sendJsonMessage({
          id: '1',
          type: 'subscribe',
          payload: {
            variables: { for: currentSession.profileId },
            query: NewNotificationSubscriptionDocument.loc?.source.body
          }
        })
      }
      sendJsonMessage({
        id: '2',
        type: 'subscribe',
        payload: {
          variables: { address },
          query: UserSigNoncesSubscriptionDocument.loc?.source.body
        }
      })
      sendJsonMessage({
        id: '3',
        type: 'subscribe',
        payload: {
          variables: { authorizationId: getCurrentSession().authorizationId },
          query: AuthorizationRecordRevokedSubscriptionDocument.loc?.source.body
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyState, currentSession?.profileId])

  useEffect(() => {
    const jsonData = JSON.parse(lastMessage?.data || '{}')
    const data = jsonData?.payload?.data

    if (currentSession?.profileId && data) {
      if (jsonData.id === '1') {
        const notification = data.newNotification as Notification
        if (notification) {
          setLatestNotificationId(notification?.id)
        }
      }
      if (jsonData.id === '2') {
        const userSigNonces = data.userSigNonces as UserSigNonces
        if (userSigNonces) {
          setLensHubOnchainSigNonce(userSigNonces.lensHubOnchainSigNonce)
        }
      }
      if (jsonData.id === '3') {
        signOut()
        resetApolloStore()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage, currentSession?.profileId])

  return null
}

export default SubscriptionProvider
