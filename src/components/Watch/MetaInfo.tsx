import ArweaveExplorerLink from '@components/Common/Links/ArweaveExplorerLink'
import IPFSLink from '@components/Common/Links/IPFSLink'
import TokenExplorerLink from '@components/Common/Links/TokenExplorerLink'
import getMetadataHash from '@utils/functions/getMetadataHash'
import getTagName from '@utils/functions/getTagName'
import {
  getIsIPFSUrl,
  getPermanentVideoUrl
} from '@utils/functions/getVideoUrl'
import React, { FC } from 'react'
import { AiOutlineTag } from 'react-icons/ai'
import { BiLinkExternal } from 'react-icons/bi'
import { LenstubePublication } from 'src/types/local'

type Props = {
  video: LenstubePublication
}

const MetaInfo: FC<Props> = ({ video }) => {
  const isIPFS = getIsIPFSUrl(getPermanentVideoUrl(video))

  return (
    <div className="flex items-center space-x-1 opacity-80">
      {video?.metadata?.tags[0] && (
        <div className="flex items-center space-x-1 text-sm">
          <AiOutlineTag />
          <span>{getTagName(video.metadata.tags[0])}</span>
        </div>
      )}
      <span className="middot" />
      {isIPFS ? (
        <IPFSLink hash={getMetadataHash(video)}>
          <div className="flex items-center space-x-1">
            <div className="text-xs uppercase">Metadata</div>
            <BiLinkExternal className="text-sm" />
          </div>
        </IPFSLink>
      ) : (
        <ArweaveExplorerLink txId={getMetadataHash(video)}>
          <div className="flex items-center space-x-1">
            <div className="text-xs uppercase">Metadata</div>
            <BiLinkExternal className="text-sm" />
          </div>
        </ArweaveExplorerLink>
      )}
      <span className="middot" />
      {video.collectNftAddress && (
        <TokenExplorerLink address={video.collectNftAddress}>
          <div className="flex items-center space-x-1">
            <div className="text-xs uppercase">View NFT</div>
            <BiLinkExternal className="text-sm" />
          </div>
        </TokenExplorerLink>
      )}
    </div>
  )
}

export default MetaInfo
