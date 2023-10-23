import MetaTags from '@components/Common/MetaTags'
import React from 'react'

import ModulePermissions from './Modules'

const Permissions = () => {
  return (
    <div className="dark:bg-bunker tape-border rounded-medium bg-white p-5">
      <MetaTags title="Permissions" />
      <ModulePermissions />
    </div>
  )
}

export default Permissions
