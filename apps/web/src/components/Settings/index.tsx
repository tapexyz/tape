import MetaTags from '@components/Common/MetaTags'
import SettingsShimmer from '@components/Shimmers/SettingsShimmer'
import useAuthPersistStore from '@lib/store/auth'
import { t } from '@lingui/macro'
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
import ProfileManager from './Manager'
import ProfileInterests from './ProfileInterests'
import Sessions from './Sessions'
import SideNav from './SideNav'
import Subscription from './Subscription'

export const SETTINGS_SUBSCRIPTION = '/settings/subscription'
export const SETTINGS_INTERESTS = '/settings/interests'
export const SETTINGS_ALLOWANCE = '/settings/allowance'
export const SETTINGS_MANAGER = '/settings/manager'
export const SETTINGS_SESSIONS = '/settings/sessions'
export const SETTINGS_BLOCKED = '/settings/blocked'
export const SETTINGS_DANGER_ZONE = '/settings/danger'
export const SETTINGS = '/settings'

const Settings = () => {
  const router = useRouter()
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  useEffect(() => {
    Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.SETTINGS })
  }, [])

  const { data, loading, error } = useProfileQuery({
    variables: {
      request: { forProfileId: selectedSimpleProfile?.id }
    },
    skip: !selectedSimpleProfile?.id
  })

  if (error) {
    return <Custom500 />
  }
  if (loading || !data) {
    return <SettingsShimmer />
  }

  if (!data?.profile || (!selectedSimpleProfile && router.isReady)) {
    return <Custom404 />
  }

  const channel = data?.profile as Profile

  return (
    <div className="ultrawide:max-w-screen-xl container mx-auto">
      <MetaTags title={t`Profile Settings`} />
      {!loading && !error && channel ? (
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-1">
            <SideNav />
          </div>
          <div className="md:col-span-3">
            {router.pathname === SETTINGS && <BasicInfo profile={channel} />}
            {router.pathname === SETTINGS_SUBSCRIPTION && (
              <Subscription channel={channel} />
            )}
            {router.pathname === SETTINGS_ALLOWANCE && <Allowance />}
            {router.pathname === SETTINGS_INTERESTS && <ProfileInterests />}
            {router.pathname === SETTINGS_SESSIONS && <Sessions />}
            {router.pathname === SETTINGS_MANAGER && <ProfileManager />}
            {router.pathname === SETTINGS_BLOCKED && <Blocked />}
            {router.pathname === SETTINGS_DANGER_ZONE && <DangerZone />}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Settings
