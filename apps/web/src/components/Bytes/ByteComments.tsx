import NonRelevantComments from '@components/Watch/Comments/NonRelevantComments'
import VideoComments from '@components/Watch/Comments/VideoComments'
import type { MirrorablePublication } from '@lenstube/lens'
import { CustomCommentsFilterEnum } from '@lenstube/lens/custom-types'
import useChannelStore from '@lib/store/channel'
import type { FC } from 'react'
import React from 'react'

type Props = {
  video: MirrorablePublication
}

const ByteComments: FC<Props> = ({ video }) => {
  const selectedCommentFilter = useChannelStore(
    (state) => state.selectedCommentFilter
  )

  return (
    <div className="no-scrollbar max-h-[40vh] overflow-y-auto pt-3">
      <VideoComments video={video} hideTitle />
      {selectedCommentFilter === CustomCommentsFilterEnum.RELEVANT_COMMENTS ? (
        <NonRelevantComments video={video} className="pt-4" />
      ) : null}
    </div>
  )
}

export default ByteComments
