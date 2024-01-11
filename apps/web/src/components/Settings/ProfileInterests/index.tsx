import MetaTags from '@components/Common/MetaTags'
import { TAPE_APP_NAME } from '@tape.xyz/constants'
import React from 'react'

import Topics from './Topics'

const ProfileInterests = () => {
  return (
    <>
      <MetaTags title="Profile Interests" />
      <div className="mb-5 space-y-2">
        <h1 className="text-brand-400 text-xl font-bold">Interests</h1>
        <p className="text opacity-80">
          There is so much good content on {TAPE_APP_NAME}, it may be hard to
          find what's most relevant to you from time to time. That's where
          profile interests can help curate content the way you like.
        </p>
      </div>
      <Topics />
    </>
  )
}

export default ProfileInterests
