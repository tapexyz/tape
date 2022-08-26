import { useQuery } from '@apollo/client'
import MetaTags from '@components/Common/MetaTags'
import ChannelShimmer from '@components/Shimmers/ChannelShimmer'
import { PROFILE_QUERY } from '@gql/queries'
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

  useEffect(() => {
    Mixpanel.track(TRACK.PAGE_VIEW.CHANNEL)
  }, [])

  const { data, loading, error } = useQuery(PROFILE_QUERY, {
    variables: {
      request: { handles: query.channel }
    },
    skip: !query.channel
  })

  if (error) return <Custom500 />
  if (data?.profiles?.items?.length === 0) return <Custom404 />

  const channel: Profile = data?.profiles?.items[0]

  return (
    <>
      {loading && <ChannelShimmer />}
      {!loading && !error && channel ? (
        <>
          <MetaTags title={channel?.handle} />
          <BasicInfo channel={channel} />
          <Activities channel={channel} />
        </>
      ) : null}
    </>
  )
}

export default Channel
