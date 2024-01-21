import MetaTags from '@components/Common/MetaTags'
import SettingsShimmer from '@components/Shimmers/SettingsShimmer'
import useProfileStore from '@lib/store/idb/profile'
import { EVENTS, Tower } from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import { useProfileQuery } from '@tape.xyz/lens'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'

import Allowance from './Allowance'
import BasicInfo from './BasicInfo'
import Blocked from './Blocked'
import DangerZone from './DangerZone'
import FollowSettings from './Follow'
import Handles from './Handles'
import ProfileManager from './Manager'
import ProfileInterests from './ProfileInterests'
import Sessions from './Sessions'
import SettingsSidebar from './SettingsSidebar'

export const SETTINGS_FOLLOW = '/settings/follow'
export const SETTINGS_HANDLES = '/settings/handles'
export const SETTINGS_INTERESTS = '/settings/interests'
export const SETTINGS_ALLOWANCE = '/settings/allowance'
export const SETTINGS_MANAGER = '/settings/manager'
export const SETTINGS_SESSIONS = '/settings/sessions'
export const SETTINGS_BLOCKED = '/settings/blocked'
export const SETTINGS_DANGER_ZONE = '/settings/danger'
export const SETTINGS = '/settings'

const Settings = () => {
  const router = useRouter()
  const { activeProfile } = useProfileStore()

  useEffect(() => {
    Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.SETTINGS })
  }, [])

  const { data, loading, error } = useProfileQuery({
    variables: {
      request: { forProfileId: activeProfile?.id }
    },
    skip: !activeProfile?.id
  })

  if (error) {
    return <Custom500 />
  }
  if (loading) {
    return <SettingsShimmer />
  }

  if (!data?.profile) {
    return <Custom404 />
  }

  const profile = data?.profile as Profile

  return (
    <>
      <MetaTags title="Profile Settings" />
      {!loading && !error && profile ? (
        <div className="container mx-auto flex h-full w-full max-w-screen-lg flex-col md:flex-row">
          <div className="flex-none md:px-6">
            <SettingsSidebar />
          </div>
          <div className="w-full pb-6">
            {router.pathname === SETTINGS && <BasicInfo profile={profile} />}
            {router.pathname === SETTINGS_FOLLOW && (
              <FollowSettings profile={profile} />
            )}
            {router.pathname === SETTINGS_ALLOWANCE && <Allowance />}
            {router.pathname === SETTINGS_INTERESTS && <ProfileInterests />}
            {router.pathname === SETTINGS_SESSIONS && <Sessions />}
            {router.pathname === SETTINGS_MANAGER && <ProfileManager />}
            {router.pathname === SETTINGS_HANDLES && <Handles />}
            {router.pathname === SETTINGS_BLOCKED && <Blocked />}
            {router.pathname === SETTINGS_DANGER_ZONE && <DangerZone />}
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Settings
