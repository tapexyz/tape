import type { MirrorablePublication } from '@tape.xyz/lens'
import type { FC } from 'react'

import PublicationComments from '@components/Common/Publication/PublicationComments'
import NonRelevantComments from '@components/Watch/Comments/NonRelevantComments'
import useCommentStore from '@lib/store/comment'
import { CustomCommentsFilterEnum } from '@tape.xyz/lens/custom-types'
import React from 'react'

type Props = {
  video: MirrorablePublication
}

const ByteComments: FC<Props> = ({ video }) => {
  const selectedCommentFilter = useCommentStore(
    (state) => state.selectedCommentFilter
  )

  return (
    <div className="no-scrollbar max-h-[40vh] overflow-y-auto">
      <PublicationComments hideTitle publication={video} />
      {selectedCommentFilter === CustomCommentsFilterEnum.RELEVANT_COMMENTS ? (
        <NonRelevantComments video={video} />
      ) : null}
    </div>
  )
}

export default ByteComments
