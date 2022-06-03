import { useQuery } from '@apollo/client'
import Layout from '@components/CommonT/Layout'
import MetaTags from '@components/CommonT/MetaTags'
import ChannelShimmer from '@components/Shimmers/ChannelShimmer'
import { PROFILE_QUERY } from '@utils/gql/queries'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'
import { Profile } from 'src/types'

const Activities = dynamic(() => import('./Activities'))
const Upload = dynamic(() => import('./Upload'))
const BasicInfo = dynamic(() => import('./BasicInfo'))

const Channel = () => {
  const { query } = useRouter()
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
    <Layout>
      {loading && <ChannelShimmer />}
      {!loading && !error && channel ? (
        <>
          <MetaTags title={channel?.handle} />
          <Upload />
          <BasicInfo channel={channel} />
          <Activities channel={channel} />
        </>
      ) : null}
    </Layout>
  )
}

export default Channel
