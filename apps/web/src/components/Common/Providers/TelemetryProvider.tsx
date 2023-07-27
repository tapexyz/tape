import {
  IS_PRODUCTION,
  MIXPANEL_API_HOST,
  MIXPANEL_TOKEN
} from '@lenstube/constants'
import useChannelStore from '@lib/store/channel'
import mixpanel from 'mixpanel-browser'
import type { FC } from 'react'
import { useEffect } from 'react'

if (IS_PRODUCTION) {
  mixpanel.init(MIXPANEL_TOKEN, {
    ignore_dnt: true,
    api_host: MIXPANEL_API_HOST
  })
}

const TelemetryProvider: FC = () => {
  const selectedChannel = useChannelStore((state) => state.selectedChannel)

  useEffect(() => {
    if (IS_PRODUCTION && selectedChannel?.id) {
      mixpanel.identify(selectedChannel?.id)
      mixpanel.people.set({
        $name: selectedChannel?.handle,
        $last_active: new Date()
      })
      mixpanel.people.set_once({
        $created_at: new Date()
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannel?.id])

  return null
}

export default TelemetryProvider
