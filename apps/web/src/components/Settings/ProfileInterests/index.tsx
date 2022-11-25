import React from 'react'

import Topics from './Topics'

const ProfileInterests = () => {
  return (
    <div className="p-5 space-y-6 bg-white rounded-xl dark:bg-theme">
      <p>
        There is so much good content on Lenstube, it may be hard to find what’s
        most relevant to you from time to time. That’s where profile interests
        can help curate content the way you like.
      </p>
      <Topics showSave />
    </div>
  )
}

export default ProfileInterests
