import ExternalOutline from '@components/Common/Icons/ExternalOutline'
import TagOutline from '@components/Common/Icons/TagOutline'
import ArweaveExplorerLink from '@components/Common/Links/ArweaveExplorerLink'
import IPFSLink from '@components/Common/Links/IPFSLink'
import TokenExplorerLink from '@components/Common/Links/TokenExplorerLink'
import type { FC } from 'react'
import React from 'react'
import type { LenstubePublication } from 'utils'
import { Analytics, TRACK } from 'utils'
import getCategoryName from 'utils/functions/getCategoryName'
import getMetadataHash from 'utils/functions/getMetadataHash'
import { getIsIPFSUrl } from 'utils/functions/getVideoUrl'

type Props = {
  video: LenstubePublication
}

const MetaInfo: FC<Props> = ({ video }) => {
  const isIPFS = getIsIPFSUrl(video.onChainContentURI)

  return (
    <div className="flex flex-wrap items-center space-x-1 opacity-80">
      {video?.metadata?.tags[0] && (
        <div className="flex items-center space-x-1 text-sm">
          <TagOutline className="w-4 h-4" />
          <span className="whitespace-nowrap">
            {getCategoryName(video.metadata.tags[0])}
          </span>
        </div>
      )}
      {video?.metadata?.tags[0] && <span className="middot" />}

      {isIPFS ? (
        <IPFSLink hash={getMetadataHash(video)}>
          <div
            onClick={() => Analytics.track(TRACK.CLICK_VIEW_METADATA)}
            className="flex items-center space-x-1"
          >
            <div className="text-sm whitespace-nowrap">View Metadata</div>
            <ExternalOutline className="w-3.5 h-3.5" />
          </div>
        </IPFSLink>
      ) : (
        <ArweaveExplorerLink txId={getMetadataHash(video)}>
          <div
            onClick={() => Analytics.track(TRACK.CLICK_VIEW_METADATA)}
            className="flex items-center space-x-1"
          >
            <div className="text-sm whitespace-nowrap">View Metadata</div>
            <ExternalOutline className="w-3.5 h-3.5" />
          </div>
        </ArweaveExplorerLink>
      )}
      {video.collectNftAddress && (
        <div
          onClick={() => Analytics.track(TRACK.CLICK_VIEW_TOKEN)}
          className="items-center hidden space-x-1 md:flex"
        >
          <span className="middot" />
          <TokenExplorerLink address={video.collectNftAddress}>
            <div className="flex items-center space-x-1">
              <div className="text-sm whitespace-nowrap">View Token</div>
              <ExternalOutline className="w-3.5 h-3.5" />
            </div>
          </TokenExplorerLink>
        </div>
      )}
    </div>
  )
}

export default MetaInfo
