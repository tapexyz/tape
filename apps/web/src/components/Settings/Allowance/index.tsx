import MetaTags from '@components/Common/MetaTags'
import React from 'react'

import ModuleAllowance from './Modules'

const Allowance = () => {
  return (
    <div className="tape-border rounded-medium dark:bg-cod bg-white p-5">
      <MetaTags title="Allowance" />
      <ModuleAllowance />
    </div>
  )
}

export default Allowance
