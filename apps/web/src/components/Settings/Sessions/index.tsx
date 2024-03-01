import MetaTags from '@components/Common/MetaTags'
import React from 'react'

import List from './List'

const Sessions = () => {
  return (
    <>
      <MetaTags title="Sessions" />
      <div className="mb-5 space-y-2">
        <h1 className="text-brand-400 text-xl font-bold">
          Authorized Sessions
        </h1>
        <p className="text opacity-80">
          Here is a list of devices that have logged into your account. If any
          of these sessions seem unfamiliar to you, kindly revoke their access.
        </p>
      </div>
      <List />
    </>
  )
}

export default Sessions
