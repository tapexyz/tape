import MetaTags from '@components/Common/MetaTags'
import useProfileStore from '@lib/store/profile'
import { ADMIN_IDS } from '@tape.xyz/constants'
import React from 'react'
import Custom404 from 'src/pages/404'

import Deployment from './Deployment'
import Recents from './Recents'

const Mod = () => {
  const { activeProfile } = useProfileStore()

  if (!ADMIN_IDS.includes(activeProfile?.id)) {
    return <Custom404 />
  }

  return (
    <>
      <MetaTags title="Stats" />
      <Deployment />
      <Recents />
    </>
  )
}

export default Mod
