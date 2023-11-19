import MetaTags from '@components/Common/MetaTags'
import { ADMIN_IDS } from '@dragverse/constants'
import useProfileStore from '@lib/store/profile'
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
