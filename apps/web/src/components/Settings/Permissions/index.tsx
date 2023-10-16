import React from 'react'

import DispatcherPermissions from './Dispatcher'
import ModulePermissions from './Modules'

const Permissions = () => {
  return (
    <div className="dark:bg-bunker tape-border rounded-medium bg-white p-5">
      <DispatcherPermissions />
      <ModulePermissions />
    </div>
  )
}

export default Permissions
