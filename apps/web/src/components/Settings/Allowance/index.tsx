import MetaTags from '@components/Common/MetaTags'
import React from 'react'

import ModuleAllowance from './Modules'

const Allowance = () => {
  return (
    <div className="dark:bg-bunker tape-border rounded-medium bg-white p-5">
      <MetaTags title="Allowance" />
      <ModuleAllowance />
    </div>
  )
}

export default Allowance
