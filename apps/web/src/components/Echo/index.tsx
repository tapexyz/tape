import useAppStore from '@lib/store'
import React from 'react'
import { FEATURE_FLAGS } from 'utils/data/feature-flags'
import getIsFeatureEnabled from 'utils/functions/getIsFeatureEnabled'

import Curated from './Curated'
import Wrapper from './Wrapper'

const Echo = () => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  if (!getIsFeatureEnabled(FEATURE_FLAGS.LENSTUBE_ECHOS, selectedChannel?.id)) {
    return null
  }

  return (
    <Wrapper>
      <Curated />
    </Wrapper>
  )
}

export default Echo
