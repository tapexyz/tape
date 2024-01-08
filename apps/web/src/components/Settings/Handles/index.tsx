import MetaTags from '@components/Common/MetaTags'
import React from 'react'

import List from './List'

const Handles = () => {
  return (
    <div>
      <MetaTags title="Owned Handles" />
      <div className="mb-5 space-y-2">
        <h1 className="text-brand-400 text-xl font-bold">Owned Handles</h1>
        <p className="text opacity-80">
          List of handles with profile owned by the connected address.
        </p>
      </div>
      <List />
    </div>
  )
}

export default Handles
