import ExternalOutline from '@components/Common/Icons/ExternalOutline'
import TagOutline from '@components/Common/Icons/TagOutline'
import ArweaveExplorerLink from '@components/Common/Links/ArweaveExplorerLink'
import IPFSLink from '@components/Common/Links/IPFSLink'
import TokenExplorerLink from '@components/Common/Links/TokenExplorerLink'
import type { Publication } from '@lenstube/lens'
import { Trans } from '@lingui/macro'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { Analytics, TRACK } from 'utils'
import getCategoryName from 'utils/functions/getCategoryName'
import getMetadataHash from 'utils/functions/getMetadataHash'
import { getIsIPFSUrl } from 'utils/functions/getPublicationMediaUrl'

type Props = {
  video: Publication
}

const MetaInfo: FC<Props> = ({ video }) => {
  const isIPFS = getIsIPFSUrl(video.onChainContentURI)

  return (
    <div className="flex flex-wrap items-center space-x-1 opacity-80">
      {video?.metadata?.tags[0] && (
        <Link
          href={`/explore/${video.metadata.tags[0]}`}
          className="flex items-center space-x-1 text-sm"
        >
          <TagOutline className="h-4 w-4" />
          <span className="whitespace-nowrap">
            {getCategoryName(video.metadata.tags[0])}
          </span>
        </Link>
      )}
      {video?.metadata?.tags[0] && <span className="middot" />}

      {isIPFS ? (
        <IPFSLink hash={getMetadataHash(video)}>
          <div
            onClick={() => Analytics.track(TRACK.CLICK_VIEW_METADATA)}
            className="flex items-center space-x-1"
            role="button"
          >
            <div className="whitespace-nowrap text-sm">
              <Trans>View Metadata</Trans>
            </div>
            <ExternalOutline className="h-3.5 w-3.5" />
          </div>
        </IPFSLink>
      ) : (
        <ArweaveExplorerLink txId={getMetadataHash(video)}>
          <div
            onClick={() => Analytics.track(TRACK.CLICK_VIEW_METADATA)}
            className="flex items-center space-x-1"
            role="button"
          >
            <div className="whitespace-nowrap text-sm">
              <Trans>View Metadata</Trans>
            </div>
            <ExternalOutline className="h-3.5 w-3.5" />
          </div>
        </ArweaveExplorerLink>
      )}
      {video.collectNftAddress && (
        <div
          onClick={() => Analytics.track(TRACK.CLICK_VIEW_TOKEN)}
          className="hidden items-center space-x-1 md:flex"
          role="button"
        >
          <span className="middot" />
          <TokenExplorerLink address={video.collectNftAddress}>
            <div className="flex items-center space-x-1">
              <div className="whitespace-nowrap text-sm">
                <Trans>View Token</Trans>
              </div>
              <ExternalOutline className="h-3.5 w-3.5" />
            </div>
          </TokenExplorerLink>
        </div>
      )}
      {video.dataAvailabilityProofs && (
        <div
          onClick={() => Analytics.track(TRACK.CLICK_VIEW_PROOF)}
          className="hidden items-center space-x-1 md:flex"
          role="button"
        >
          <span className="middot" />
          <ArweaveExplorerLink
            txId={video.dataAvailabilityProofs?.replace('ar://', '')}
          >
            <div className="flex items-center space-x-1">
              <div className="whitespace-nowrap text-sm">
                <Trans>View Proof</Trans>
              </div>
              <ExternalOutline className="h-3.5 w-3.5" />
            </div>
          </ArweaveExplorerLink>
        </div>
      )}
    </div>
  )
}

export default MetaInfo
