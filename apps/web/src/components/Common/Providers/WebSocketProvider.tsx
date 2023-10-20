import usePersistStore from '@lib/store/persist'
import useProfileStore from '@lib/store/profile'
import { LENS_API_URL } from '@tape.xyz/constants'
import { NewNotificationDocument } from '@tape.xyz/lens'
import { useEffect } from 'react'
import useWebSocket from 'react-use-websocket'

const WebSocketProvider = () => {
  const activeProfile = useProfileStore((state) => state.activeProfile)
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyState, activeProfile?.id])

  useEffect(() => {
    const jsonData = JSON.parse(lastMessage?.data || '{}')
    const data = jsonData?.payload?.data

    if (activeProfile?.id && data && data?.newNotification?.id) {
      setLatestNotificationId(data.newNotification.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage, activeProfile?.id])

  return null
}

export default WebSocketProvider
