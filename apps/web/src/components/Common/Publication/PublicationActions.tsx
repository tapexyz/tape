import MirrorPublication from '@components/Common/MirrorPublication'
import PublicationOptions from '@components/Common/Publication/PublicationOptions'
import { getProfile } from '@tape.xyz/generic'
import type { MirrorablePublication } from '@tape.xyz/lens'
import { TriStateValue } from '@tape.xyz/lens'
import {
  CollectOutline,
  MirrorOutline,
  Modal,
  ThreeDotsOutline,
  TipOutline
} from '@tape.xyz/ui'
import type { FC } from 'react'
import React, { useState } from 'react'

import OpenActions from '../../Watch/OpenActions'
import TipForm from '../../Watch/TipForm'
import PublicationReaction from './PublicationReaction'

type Props = {
  publication: MirrorablePublication
}

const PublicationActions: FC<Props> = ({ publication }) => {
  const [showTip, setShowTip] = useState(false)
  return (
    <div className="mt-4 flex justify-end space-x-1">
      <div className="tape-border flex items-center justify-end overflow-hidden rounded-full bg-gray-100 dark:bg-gray-900">
        <PublicationReaction
          publication={publication}
          textSize="inherit"
          iconSize="base"
          className="flex items-center px-4 py-1 hover:bg-gray-200 dark:hover:bg-gray-800"
        />
        {publication.operations.canComment !== TriStateValue.No ? (
          <>
            <button
              onClick={() => setShowTip(true)}
              className="flex items-center space-x-1 px-4 py-1 hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              <TipOutline className="size-4 flex-none" />
              <span>Tip</span>
            </button>
            <Modal
              show={showTip}
              setShow={setShowTip}
              title={`Tip ${getProfile(publication.by)?.displayName}`}
              description="Show appreciation with a comment and tip."
            >
              <TipForm video={publication} setShow={setShowTip} />
            </Modal>
          </>
        ) : null}
        <MirrorPublication video={publication}>
          <button className="flex items-center space-x-1 px-4 py-1 hover:bg-gray-200 dark:hover:bg-gray-800">
            <MirrorOutline className="size-4 flex-none" />
            <span>Mirror</span>
          </button>
        </MirrorPublication>
        <OpenActions publication={publication}>
          <div className="flex items-center space-x-1 px-4 py-1 hover:bg-gray-200 dark:hover:bg-gray-800">
            <CollectOutline className="size-4" />
            <span>Actions</span>
          </div>
        </OpenActions>
      </div>
      <PublicationOptions publication={publication}>
        <button className="tape-border flex items-center space-x-1 rounded-full bg-gray-100 p-2 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800">
          <ThreeDotsOutline className="size-4" />
        </button>
      </PublicationOptions>
    </div>
  )
}

export default PublicationActions
