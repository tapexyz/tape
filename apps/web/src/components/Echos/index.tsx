import useAppStore from '@lib/store'
import React from 'react'
import Custom404 from 'src/pages/404'
import { FEATURE_FLAGS } from 'utils/data/feature-flags'
import getIsFeatureEnabled from 'utils/functions/getIsFeatureEnabled'

import Curated from './Curated'
import Wrapper from './Wrapper'

const Echos = () => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  if (!getIsFeatureEnabled(FEATURE_FLAGS.LENSTUBE_ECHOS, selectedChannel?.id)) {
    return <Custom404 />
  }

  return (
    <Wrapper>
      <Curated />
    </Wrapper>
  )
}

export default Echos
