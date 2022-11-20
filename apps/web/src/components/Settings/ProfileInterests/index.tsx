import React from 'react'

import Topics from './Topics'

const ProfileInterests = () => {
  return (
    <div className="p-4 space-y-6 bg-white rounded-xl dark:bg-theme">
      <p className="text-sm">
        Interests are now off-chain and will be used only to curate the way that
        API serves content.
        <span className="text-yellow-700"> (Maximum 12 interests)</span>
      </p>
      <Topics />
    </div>
  )
}

export default ProfileInterests
