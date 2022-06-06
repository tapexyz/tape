import React from 'react'
import { Profile } from 'src/types'

type Props = {
  channel: Profile
}

const Membership = ({ channel }: Props) => {
  return (
    <div className="p-3 bg-white rounded-md dark:bg-black">
      <h1 className="text-lg font-medium">Grow with Lens 🌿</h1>
    </div>
  )
}

export default Membership
