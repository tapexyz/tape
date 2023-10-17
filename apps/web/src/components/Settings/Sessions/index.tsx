import MetaTags from '@components/Common/MetaTags'
import { Trans } from '@lingui/macro'
import React from 'react'

import List from './List'

const Sessions = () => {
  return (
    <div className="dark:bg-bunker tape-border rounded-medium bg-white p-5">
      <MetaTags title="Sessions" />
      <div className="mb-5 space-y-2">
        <h1 className="text-brand-400 text-xl font-bold">
          <Trans>Authorized Sessions</Trans>
        </h1>
        <p className="text opacity-80">
          <Trans>
            Here is a list of devices that have logged into your account. If any
            of these sessions seem unfamiliar to you, kindly revoke their
            access.
          </Trans>
        </p>
      </div>
      <List />
    </div>
  )
}

export default Sessions
