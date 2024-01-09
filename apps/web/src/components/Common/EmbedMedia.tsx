import Tooltip from '@components/UIElements/Tooltip'
import { IconButton } from '@radix-ui/themes'
import { useCopyToClipboard } from '@tape.xyz/browser'
import { TAPE_APP_NAME, TAPE_EMBED_URL } from '@tape.xyz/constants'
import { EVENTS, Tower } from '@tape.xyz/generic'
import { CodeOutline, CopyOutline, Modal } from '@tape.xyz/ui'
import clsx from 'clsx'
import type { FC } from 'react'
import React, { useState } from 'react'

type Props = {
  publicationId: string
  isAudio: boolean
}

const EmbedMedia: FC<Props> = ({ publicationId, isAudio }) => {
  const [copy] = useCopyToClipboard()
  const [showEmbedModal, setShowEmbedModal] = useState(false)

  let iframeCode = `<iframe width="560" height="315" src="${TAPE_EMBED_URL}/${publicationId}?autoplay=1&t=0&loop=0" title="${TAPE_APP_NAME} player" frameborder="0" allow="accelerometer; autoplay; clipboard-write;" allowfullscreen></iframe>`

  if (isAudio) {
    iframeCode = `<iframe width="100%" height="300" src="${TAPE_EMBED_URL}/${publicationId}" title="${TAPE_APP_NAME} player" frameborder="0"></iframe>`
  }

  const onCopyCode = () => {
    copy(iframeCode)
    Tower.track(EVENTS.EMBED_VIDEO.COPY)
  }

  const openModal = () => {
    setShowEmbedModal(true)
    Tower.track(EVENTS.EMBED_VIDEO.OPEN)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => openModal()}
        className="rounded-full bg-purple-200 p-3 dark:bg-purple-800"
      >
        <CodeOutline className="size-5" />
      </button>
      <Modal
        title="Embed Media"
        size="md"
        show={showEmbedModal}
        setShow={setShowEmbedModal}
      >
        <div className="flex flex-col space-y-3">
          <div className="w-full overflow-hidden rounded">
            <iframe
              sandbox="allow-scripts allow-same-origin"
              className={clsx(
                'w-full',
                isAudio ? 'min-h-[200px]' : 'aspect-[16/9] '
              )}
              src={`${TAPE_EMBED_URL}/${publicationId}`}
              title={`${TAPE_APP_NAME} player`}
              allow="accelerometer; autoplay; clipboard-write; gyroscope;"
              allowFullScreen
            />
          </div>
          <div className="tape-border relative rounded-lg p-4">
            <code className="select-all text-sm opacity-60">{iframeCode}</code>
            <Tooltip content="Copy Code" placement="top">
              <IconButton
                type="button"
                size="1"
                variant="soft"
                onClick={() => onCopyCode()}
                className="absolute right-2 top-2"
              >
                <CopyOutline className="size-4" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default EmbedMedia
