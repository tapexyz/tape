import MetaTags from '@components/Common/MetaTags'
import { Box, Tabs } from '@radix-ui/themes'
import React from 'react'

import DispatcherPermissions from './Dispatcher'
import Managed from './Managed'
import Managers from './Managers'

const ProfileManager = () => {
  return (
    <div className="space-y-4">
      <MetaTags title="Manager" />
      <div className="tape-border rounded-medium dark:bg-cod bg-white p-5">
        <DispatcherPermissions />
      </div>

      <div className="tape-border rounded-medium dark:bg-cod bg-white p-5">
        <Tabs.Root defaultValue="managers">
          <Tabs.List>
            <Tabs.Trigger value="managers">Managers</Tabs.Trigger>
            <Tabs.Trigger value="managed">Managed</Tabs.Trigger>
          </Tabs.List>

          <Box pt="3" pb="2">
            <Tabs.Content value="managers">
              <Managers />
            </Tabs.Content>
            <Tabs.Content value="managed">
              <Managed />
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </div>
    </div>
  )
}

export default ProfileManager
