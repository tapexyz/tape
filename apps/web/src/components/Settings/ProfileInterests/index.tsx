import React from 'react'

import Topics from './Topics'

const ProfileInterests = () => {
  return (
    <div className="p-5 space-y-6 bg-white rounded-xl dark:bg-theme">
      <p>
        Interests are off-chain and will be used to curate the way that API
        serves content.
      </p>
      <span className="text-yellow-600"> (Maximum 12 interests)</span>
      <Topics />
    </div>
  )
}

export default ProfileInterests
