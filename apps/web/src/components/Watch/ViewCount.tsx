import { useVideoViews } from '@lenstube/generic'
import { Trans } from '@lingui/macro'
import React from 'react'

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
