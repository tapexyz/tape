import VideoComments from '@components/Watch/Comments/VideoComments'
import type { MirrorablePublication } from '@tape.xyz/lens'
import type { FC } from 'react'
import React from 'react'

type Props = {
  video: MirrorablePublication
}

const ByteComments: FC<Props> = ({ video }) => {
  return (
    <div className="no-scrollbar max-h-[40vh] overflow-y-auto">
      <VideoComments video={video} hideTitle />
      {/* {selectedCommentFilter === CustomCommentsFilterEnum.RELEVANT_COMMENTS ? (
        <NonRelevantComments video={video} className="pt-4" />
      ) : null} */}
    </div>
  )
}

export default ByteComments
