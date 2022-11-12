import DispatcherPermissions from './Dispatcher'
import ModulePermissions from './Modules'

const Permissions = () => {
  return (
    <div className="p-4 space-y-6 bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-theme">
      <DispatcherPermissions />
      <ModulePermissions />
    </div>
  )
}

export default Permissions
