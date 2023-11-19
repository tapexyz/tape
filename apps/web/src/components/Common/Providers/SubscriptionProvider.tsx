import { LENS_API_URL } from '@dragverse/constants'
import type { Notification, UserSigNonces } from '@dragverse/lens'
import {
  AuthorizationRecordRevokedSubscriptionDocument,
  NewNotificationSubscriptionDocument,
  UserSigNoncesSubscriptionDocument
} from '@dragverse/lens'
import { useApolloClient } from '@dragverse/lens/apollo'
import getCurrentSessionId from '@lib/getCurrentSessionId'
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId'
import { signOut } from '@lib/store/auth'
import useNonceStore from '@lib/store/nonce'
import usePersistStore from '@lib/store/persist'
import { useEffect } from 'react'
import useWebSocket from 'react-use-websocket'
import { isAddress } from 'viem'
import { useAccount } from 'wagmi'

const SubscriptionProvider = () => {
  const { address } = useAccount()
  const { setLensHubOnchainSigNonce } = useNonceStore()
  const { resetStore: resetApolloStore } = useApolloClient()
  const currentSessionProfileId = getCurrentSessionProfileId()

  const setLatestNotificationId = usePersistStore(
    (state) => state.setLatestNotificationId
  )

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    LENS_API_URL.replace('http', 'ws'),
    { protocols: ['graphql-ws'] }
  )

  useEffect(() => {
    sendJsonMessage({ type: 'connection_init' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (readyState === 1 && currentSessionProfileId) {
      if (!isAddress(currentSessionProfileId)) {
        sendJsonMessage({
          id: '1',
          type: 'start',
          payload: {
            variables: { for: currentSessionProfileId },
            query: NewNotificationSubscriptionDocument
          }
        })
      }
      sendJsonMessage({
        id: '2',
        type: 'start',
        payload: {
          variables: { address },
          query: UserSigNoncesSubscriptionDocument
        }
      })
      sendJsonMessage({
        id: '3',
        type: 'start',
        payload: {
          variables: { authorizationId: getCurrentSessionId() },
          query: AuthorizationRecordRevokedSubscriptionDocument
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyState, currentSessionProfileId])

  useEffect(() => {
    const jsonData = JSON.parse(lastMessage?.data || '{}')
    const data = jsonData?.payload?.data

    if (currentSessionProfileId && data) {
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
  }, [lastMessage, currentSessionProfileId])

  return null
}

export default SubscriptionProvider
