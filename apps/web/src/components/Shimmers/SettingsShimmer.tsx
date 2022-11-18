import { Loader } from '@components/UIElements/Loader'
import React from 'react'

const SettingsShimmer = () => {
  return (
    <div className="grid h-[80vh] place-content-center">
      <Loader />
    </div>
  )
}

export default SettingsShimmer
