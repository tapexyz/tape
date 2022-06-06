import { useQuery } from '@apollo/client'
import Layout from '@components/Common/Layout'
import MetaTags from '@components/Common/MetaTags'
import SettingsShimmer from '@components/Shimmers/SettingsShimmer'
import useAppStore from '@lib/store'
import { PROFILE_QUERY } from '@utils/gql/queries'
import useIsMounted from '@utils/hooks/useIsMounted'
import {
  SETTINGS,
  SETTINGS_MEMBERSHIP,
  SETTINGS_PERMISSIONS
} from '@utils/url-path'
import { useRouter } from 'next/router'
import React from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'
import { MediaSet, Profile } from 'src/types'

import BasicInfo from './BasicInfo'
import Membership from './Membership'
import Permissions from './Permissions'
import SideNav from './SideNav'

const Settings = () => {
  const { selectedChannel } = useAppStore()
  const isMounted = useIsMounted()
  const router = useRouter()

  const { data, loading, error } = useQuery(PROFILE_QUERY, {
    variables: {
      request: { handles: selectedChannel?.handle }
    },
    skip: !selectedChannel?.handle
  })

  if (error) return <Custom500 />
  if (data?.profiles?.items?.length === 0) return <Custom404 />
  const channel: Profile & {
    coverPicture: MediaSet
  } = data?.profiles?.items[0]

  return (
    <Layout>
      <MetaTags title="Channel settings" />
      {(loading || !isMounted()) && <SettingsShimmer />}
      {!loading && !error && channel ? (
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-1">
            <SideNav channel={channel} />
          </div>
          <div className="md:col-span-3">
            {router.pathname === SETTINGS && <BasicInfo channel={channel} />}
            {router.pathname === SETTINGS_MEMBERSHIP && (
              <Membership channel={channel} />
            )}
            {router.pathname === SETTINGS_PERMISSIONS && (
              <Permissions channel={channel} />
            )}
          </div>
        </div>
      ) : null}
    </Layout>
  )
}

export default Settings
