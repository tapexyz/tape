import IExecWalletProvider from '@components/Common/IExecWalletManager'
import MetaTags from '@components/Common/MetaTags'
import WalletType from '@lib/iexec/walletType'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@tape.xyz/ui'
import React from 'react'

import IExecManager from './IExecManager'

const ProtectedContent = () => {
  return (
    <div className="space-y-4">
      <MetaTags title="protectedcontent" />
      <IExecManager />

      <Tabs defaultValue="publisher">
        <TabsList>
          <TabsTrigger
            className="rounded-t-lg border-black px-4 py-1.5 text-sm font-medium data-[state=active]:border-b data-[state=active]:bg-gray-100 dark:border-white data-[state=active]:dark:bg-gray-800"
            value="publisher"
          >
            Content Publisher
          </TabsTrigger>
          <TabsTrigger
            className="rounded-t-lg border-black px-4 py-1.5 text-sm font-medium data-[state=active]:border-b data-[state=active]:bg-gray-100 dark:border-white data-[state=active]:dark:bg-gray-800"
            value="consumer"
          >
            Content Consumer
          </TabsTrigger>
        </TabsList>

        <div className="pb-2 pt-3">
          <TabsContent value="publisher">
            <IExecWalletProvider walletType={WalletType.CONTENT_PUBLISHER} />
          </TabsContent>
          <TabsContent value="consumer">
            <IExecWalletProvider walletType={WalletType.CONTENT_CONSUMER} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default ProtectedContent
