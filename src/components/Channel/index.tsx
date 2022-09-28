import { useQuery } from '@apollo/client'
import MetaTags from '@components/Common/MetaTags'
import ChannelShimmer from '@components/Shimmers/ChannelShimmer'
import { PROFILE_QUERY } from '@gql/queries'
import useAppStore from '@lib/store'
import { Mixpanel, TRACK } from '@utils/track'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'
import { Profile } from 'src/types'

import Activities from './Activities'
import BasicInfo from './BasicInfo'

const Channel = () => {
  const { query } = useRouter()
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  useEffect(() => {
    Mixpanel.track('Pageview', { path: TRACK.PAGE_VIEW.CHANNEL })
  }, [])

  const { data, loading, error } = useQuery(PROFILE_QUERY, {
    variables: {
      request: { handle: query.channel },
      who: selectedChannel?.id ?? null
    },
    skip: !query.channel
  })

  if (error) return <Custom500 />
  if (loading || !data) return <ChannelShimmer />
  if (!data?.profile) return <Custom404 />

  const channel: Profile = data?.profile

  return (
    <>
      <MetaTags title={channel?.handle} />
      {!loading && !error && channel ? (
        <>
          <BasicInfo channel={channel} />
          <Activities channel={channel} />
        </>
      ) : null}
    </>
  )
}

export default Channel
