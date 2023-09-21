import MetaTags from '@components/Common/MetaTags'
import { ADMIN_IDS } from '@lenstube/constants'
import useAuthPersistStore from '@lib/store/auth'
import { t } from '@lingui/macro'
import React from 'react'
import Custom404 from 'src/pages/404'

import Deployment from './Deployment'
import Recents from './Recents'

const Mod = () => {
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  if (!ADMIN_IDS.includes(selectedSimpleProfile?.id)) {
    return <Custom404 />
  }

  return (
    <>
      <MetaTags title={t`Lenstube Stats`} />
      <Deployment />
      <Recents />
    </>
  )
}

export default Mod
