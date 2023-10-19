import MetaTags from '@components/Common/MetaTags'
import { Trans } from '@lingui/macro'
import React from 'react'

import List from './List'

const Blocked = () => {
  return (
    <div className="dark:bg-bunker tape-border rounded-medium bg-white p-5">
      <MetaTags title="Blocked Profiles" />
      <div className="mb-5 space-y-2">
        <h1 className="text-brand-400 text-xl font-bold">
          <Trans>Blocked Profiles</Trans>
        </h1>
        <p className="text opacity-80">
          <Trans>
            Here is a list of profiles that you have blocked. You have the
            option to unblock them whenever you wish.
          </Trans>
        </p>
      </div>
      <List />
    </div>
  )
}

export default Blocked
