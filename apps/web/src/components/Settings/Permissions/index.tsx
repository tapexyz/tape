import { Card } from '@radix-ui/themes'
import React from 'react'

import DispatcherPermissions from './Dispatcher'
import ModulePermissions from './Modules'

const Permissions = () => {
  return (
    <Card size="3">
      <DispatcherPermissions />
      <ModulePermissions />
    </Card>
  )
}

export default Permissions
