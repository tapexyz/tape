import { Trans } from '@lingui/macro'
import React from 'react'
import Topics from './Topics'

const ProfileInterests: React.FC = () => {
  return (
    <div className="bg-theme space-y-6 rounded-xl p-5">
      <div className="mb-5">
        <h1 className="mb-1 text-xl font-semibold">
          <Trans>Interests</Trans>
        </h1>
        <p className="text opacity-80">
          <Trans>
            There is so much good content on Dragverse, it may be hard to find
            what's most relevant to you from time to time. That's where profile
            interests can help curate content the way you like.
          </Trans>
        </p>
      </div>
      <Topics />
    </div>
  )
}

export default ProfileInterests
