import useNonceStore from '@lib/store/nonce'
import usePersistStore from '@lib/store/persist'
import useProfileStore from '@lib/store/profile'
import { LENS_API_URL } from '@tape.xyz/constants'
import type { Notification, UserSigNonces } from '@tape.xyz/lens'
import { NewNotificationDocument, UserSigNoncesDocument } from '@tape.xyz/lens'
import { useEffect } from 'react'
import useWebSocket from 'react-use-websocket'

const SubscriptionProvider = () => {
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const {
    setLensHubOnchainSigNonce,
    setLensPublicActProxyOnchainSigNonce,
    setLensTokenHandleRegistryOnchainSigNonce
  } = useNonceStore()

  const setLatestNotificationId = usePersistStore(
    (state) => state.setLatestNotificationId
  )

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    LENS_API_URL.replace('http', 'ws'),
    { protocols: ['graphql-ws'] }
  )

  useEffect(() => {
    if (readyState === 1 && activeProfile?.id) {
      sendJsonMessage({
        id: '1',
        type: 'start',
        payload: {
          variables: { for: activeProfile?.id },
          query: NewNotificationDocument
        }
      })
      sendJsonMessage({
        id: '2',
        type: 'start',
        payload: {
          variables: { address: activeProfile.ownedBy.address },
          query: UserSigNoncesDocument
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyState, activeProfile?.id])

  useEffect(() => {
    const jsonData = JSON.parse(lastMessage?.data || '{}')
    const data = jsonData?.payload?.data

    if (activeProfile?.id && data) {
      if (jsonData.id === '1') {
        const notification = data.newNotification as Notification
        setLatestNotificationId(notification.id)
      }
      if (jsonData.id === '2') {
        const userSigNonces = data.userSigNonces as UserSigNonces
        setLensHubOnchainSigNonce(userSigNonces.lensHubOnchainSigNonce)
        setLensTokenHandleRegistryOnchainSigNonce(
          userSigNonces.lensTokenHandleRegistryOnchainSigNonce
        )
        setLensPublicActProxyOnchainSigNonce(
          userSigNonces.lensPublicActProxyOnchainSigNonce
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage, activeProfile?.id])

  return null
}

export default SubscriptionProvider
