import ExternalOutline from '@components/Common/Icons/ExternalOutline'
import TagOutline from '@components/Common/Icons/TagOutline'
import ArweaveExplorerLink from '@components/Common/Links/ArweaveExplorerLink'
import IPFSLink from '@components/Common/Links/IPFSLink'
import { Trans } from '@lingui/macro'
import {
  EVENTS,
  getCategoryName,
  getIsIPFSUrl,
  getMetadataCid,
  Tower
} from '@tape.xyz/generic'
import type { MirrorablePublication } from '@tape.xyz/lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

type Props = {
  video: MirrorablePublication
}

const MetaInfo: FC<Props> = ({ video }) => {
  const isIPFS = getIsIPFSUrl(video.metadata.rawURI)

  return (
    <div className="flex flex-wrap items-center space-x-1 opacity-80">
      {video?.metadata?.tags && (
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
      {video?.metadata?.tags && <span className="middot" />}

      {isIPFS ? (
        <IPFSLink hash={getMetadataCid(video)}>
          <div
            onClick={() => Tower.track(EVENTS.CLICK_VIEW_METADATA)}
            className="flex items-center space-x-1"
            tabIndex={0}
            role="button"
          >
            <div className="whitespace-nowrap text-sm">
              <Trans>View Metadata</Trans>
            </div>
            <ExternalOutline className="h-3 w-3" />
          </div>
        </IPFSLink>
      ) : (
        <ArweaveExplorerLink txId={getMetadataCid(video)}>
          <div
            onClick={() => Tower.track(EVENTS.CLICK_VIEW_METADATA)}
            tabIndex={0}
            className="flex items-center space-x-1"
            role="button"
          >
            <div className="whitespace-nowrap text-sm">
              <Trans>View Metadata</Trans>
            </div>
            <ExternalOutline className="h-3 w-3" />
          </div>
        </ArweaveExplorerLink>
      )}
      {video.momoka?.proof && (
        <div
          onClick={() => Tower.track(EVENTS.CLICK_VIEW_PROOF)}
          tabIndex={0}
          className="hidden items-center space-x-1 md:flex"
          role="button"
        >
          <span className="middot" />
          <ArweaveExplorerLink txId={video.momoka?.proof?.replace('ar://', '')}>
            <div className="flex items-center space-x-1">
              <div className="whitespace-nowrap text-sm">
                <Trans>View Proof</Trans>
              </div>
              <ExternalOutline className="h-3 w-3" />
            </div>
          </ArweaveExplorerLink>
        </div>
      )}
    </div>
  )
}

export default MetaInfo
