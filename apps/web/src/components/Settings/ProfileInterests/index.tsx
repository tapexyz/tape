import React from 'react'

import Topics from './Topics'

const ProfileInterests = () => {
  return (
    <div className="p-5 space-y-6 bg-white rounded-xl dark:bg-theme">
      <p>
        Interests are off-chain and will be used to curate the way that API
        serves content.
        <span className="text-yellow-600 block"> (Maximum 12 interests)</span>
      </p>
      <Topics showSave />
    </div>
  )
}

export default ProfileInterests
