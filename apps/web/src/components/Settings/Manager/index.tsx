import MetaTags from '@components/Common/MetaTags'
import { Box, Tabs } from '@radix-ui/themes'
import React from 'react'

import Managed from './Managed'
import Managers from './Managers'

const ProfileManager = () => {
  return (
    <div className="dark:bg-bunker tape-border rounded-medium bg-white p-5">
      <MetaTags title="Manager" />

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
  )
}

export default ProfileManager
