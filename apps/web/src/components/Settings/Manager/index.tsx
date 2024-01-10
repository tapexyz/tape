import MetaTags from '@components/Common/MetaTags'
import * as Tabs from '@radix-ui/react-tabs'
import React from 'react'

import LensManager from './LensManager'
import Managed from './Managed'
import Managers from './Managers'

const ProfileManager = () => {
  return (
    <div className="space-y-4">
      <MetaTags title="Manager" />
      <LensManager />

      <Tabs.Root defaultValue="managers">
        <Tabs.List>
          <Tabs.Trigger
            className="rounded-t-lg border-black px-4 py-1.5 text-sm font-medium data-[state=active]:border-b data-[state=active]:bg-gray-100 dark:border-white data-[state=active]:dark:bg-gray-800"
            value="managers"
          >
            Managers
          </Tabs.Trigger>
          <Tabs.Trigger
            className="rounded-t-lg border-black px-4 py-1.5 text-sm font-medium data-[state=active]:border-b data-[state=active]:bg-gray-100 dark:border-white data-[state=active]:dark:bg-gray-800"
            value="managed"
          >
            Managed
          </Tabs.Trigger>
        </Tabs.List>

        <div className="pb-2 pt-3">
          <Tabs.Content value="managers">
            <Managers />
          </Tabs.Content>
          <Tabs.Content value="managed">
            <Managed />
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  )
}

export default ProfileManager
