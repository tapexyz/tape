import MirrorPublication from '@components/Common/MirrorPublication'
import PublicationOptions from '@components/Common/Publication/PublicationOptions'
import PublicationReaction from '@components/Common/Publication/PublicationReaction'
import OpenActions from '@components/Watch/OpenActions'
import { Button } from '@radix-ui/themes'
import type { MirrorablePublication } from '@tape.xyz/lens'
import {
  CollectOutline,
  CommentOutline,
  MirrorOutline,
  Modal
} from '@tape.xyz/ui'
import type { FC } from 'react'
import React, { useState } from 'react'

import ByteComments from './ByteComments'

type Props = {
  video: MirrorablePublication
}

const ByteActions: FC<Props> = ({ video }) => {
  const [showCommentsModal, setShowCommentsModal] = useState(false)

  return (
    <div className="flex w-16 flex-col items-center justify-between">
      <div className="pt-2">
        <PublicationOptions publication={video} />
      </div>
      <div className="items-center pt-2.5 md:flex md:flex-col">
        <div className="pb-2">
          <PublicationReaction
            className="w-7"
            publication={video}
            iconSize="lg"
            isVertical
          />
        </div>
        <div className="space-y-4 py-2">
          <div className="w-full text-center">
            <button className="w-7" onClick={() => setShowCommentsModal(true)}>
              <div className="flex flex-col items-center text-black dark:text-white">
                <CommentOutline className="size-5" />
                <span className="pt-1 text-xs">
                  {video.stats.comments || 'Wdyt'}
                </span>
              </div>
            </button>
            <Modal
              title="Comments"
              show={showCommentsModal}
              setShow={setShowCommentsModal}
            >
              <ByteComments video={video} />
            </Modal>
          </div>
          <div className="w-full text-center">
            <MirrorPublication video={video}>
              <Button variant="ghost" className="w-7" highContrast>
                <div className="flex flex-col items-center">
                  <MirrorOutline className="size-5" />
                  <span className="pt-1 text-xs">
                    {video.stats?.mirrors || 'Mirror'}
                  </span>
                </div>
              </Button>
            </MirrorPublication>
          </div>
          <div className="w-full text-center">
            <OpenActions publication={video}>
              <Button variant="ghost" className="w-7" highContrast>
                <div className="flex flex-col items-center">
                  <CollectOutline className="size-5" />
                  <span className="pt-1 text-xs">
                    {video.stats?.countOpenActions || 'Collect'}
                  </span>
                </div>
              </Button>
            </OpenActions>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ByteActions
