import MetaTags from '@components/Common/MetaTags'
import React from 'react'

import ModuleAllowance from './Modules'

const Allowance = () => {
  return (
    <div className="tape-border rounded-medium bg-white p-5 dark:bg-black">
      <MetaTags title="Allowance" />
      <ModuleAllowance />
    </div>
  )
}

export default Allowance
