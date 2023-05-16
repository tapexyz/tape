import { Trans } from '@lingui/macro'
import React from 'react'
import useVideoViews from 'utils/hooks/useVideoViews'

const ViewCount = ({ cid }: { cid: string }) => {
  const { views } = useVideoViews(cid)

  return (
    <>
      <span>
        {views} <Trans>views</Trans>
      </span>
      <span className="middot px-1" />
    </>
  )
}

export default ViewCount
