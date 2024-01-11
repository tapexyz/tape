import MetaTags from '@components/Common/MetaTags'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@tape.xyz/ui'
import React from 'react'

import LensManager from './LensManager'
import Managed from './Managed'
import Managers from './Managers'

const ProfileManager = () => {
  return (
    <div className="space-y-4">
      <MetaTags title="Manager" />
      <LensManager />

      <Tabs defaultValue="managers">
        <TabsList>
          <TabsTrigger
            className="rounded-t-lg border-black px-4 py-1.5 text-sm font-medium data-[state=active]:border-b data-[state=active]:bg-gray-100 dark:border-white data-[state=active]:dark:bg-gray-800"
            value="managers"
          >
            Managers
          </TabsTrigger>
          <TabsTrigger
            className="rounded-t-lg border-black px-4 py-1.5 text-sm font-medium data-[state=active]:border-b data-[state=active]:bg-gray-100 dark:border-white data-[state=active]:dark:bg-gray-800"
            value="managed"
          >
            Managed
          </TabsTrigger>
        </TabsList>

        <div className="pb-2 pt-3">
          <TabsContent value="managers">
            <Managers />
          </TabsContent>
          <TabsContent value="managed">
            <Managed />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default ProfileManager
