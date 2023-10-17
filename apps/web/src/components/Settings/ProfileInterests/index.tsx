import MetaTags from '@components/Common/MetaTags'
import { Trans } from '@lingui/macro'
import { TAPE_APP_NAME } from '@tape.xyz/constants'
import React from 'react'

import Topics from './Topics'

const ProfileInterests = () => {
  return (
    <div className="dark:bg-bunker tape-border rounded-medium bg-white p-5">
      <MetaTags title="Profile Interests" />
      <div className="mb-5 space-y-2">
        <h1 className="text-brand-400 text-xl font-bold">
          <Trans>Interests</Trans>
        </h1>
        <p className="text opacity-80">
          There is so much good content on {TAPE_APP_NAME}, it may be hard to
          find what's most relevant to you from time to time. That's where
          profile interests can help curate content the way you like.
        </p>
      </div>
      <Topics />
    </div>
  )
}

export default ProfileInterests
