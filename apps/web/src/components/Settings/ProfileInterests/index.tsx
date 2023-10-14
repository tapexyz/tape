import { Trans } from '@lingui/macro'
import { Card } from '@radix-ui/themes'
import { TAPE_APP_NAME } from '@tape.xyz/constants'
import React from 'react'

import Topics from './Topics'

const ProfileInterests = () => {
  return (
    <Card size="3">
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
    </Card>
  )
}

export default ProfileInterests
