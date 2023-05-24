import DispatcherPermissions from './Dispatcher'
import ModulePermissions from './Modules'

const Permissions = () => {
  return (
    <div className="bg-theme space-y-6 divide-y divide-gray-200 rounded-xl bg-white p-4 dark:divide-gray-700">
      <DispatcherPermissions />
      <ModulePermissions />
    </div>
  )
}

export default Permissions
