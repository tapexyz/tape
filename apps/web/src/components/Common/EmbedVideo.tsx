import Modal from '@components/UIElements/Modal'
import Tooltip from '@components/UIElements/Tooltip'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Analytics, LENSTUBE_EMBED_URL, TRACK } from 'utils'
import useCopyToClipboard from 'utils/hooks/useCopyToClipboard'

import CodeOutline from './Icons/CodeOutline'

type Props = {
  videoId: string
  onClose: () => void
}

const EmbedVideo: FC<Props> = ({ videoId, onClose }) => {
  const [showModal, setShowModal] = useState(false)
  const [copy] = useCopyToClipboard()

  const iframeCode = `<iframe width="560" height="315" src="${LENSTUBE_EMBED_URL}/${videoId}?autoplay=1&t=0&loop=0" title="Lenstube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write;" allowfullscreen></iframe>`

  const onCopyCode = () => {
    Analytics.track(TRACK.EMBED_VIDEO.COPY)
    copy(iframeCode)
    toast.success('Copied to clipboard')
  }

  const closeModal = () => {
    setShowModal(false)
    onClose()
  }

  const openModal = () => {
    setShowModal(true)
    Analytics.track(TRACK.EMBED_VIDEO.OPEN)
  }

  return (
    <div>
      <Modal
        title="Embed Video"
        onClose={closeModal}
        show={showModal}
        panelClassName="max-w-xl"
      >
        <div className="mt-2">
          <div className="flex flex-col space-y-3">
            <div className="w-full">
              <iframe
                sandbox="allow-scripts allow-same-origin"
                className="aspect-[16/9] w-full"
                src={`${LENSTUBE_EMBED_URL}/${videoId}`}
                title="Lenstube video player"
                allow="accelerometer; autoplay; clipboard-write; gyroscope;"
                allowFullScreen
              />
            </div>
            <div className="col-span-2">
              <button
                type="button"
                onClick={() => onCopyCode()}
                className="select-all rounded-xl border p-4 text-left dark:border-gray-800"
              >
                <code className="select-all text-sm opacity-60">
                  {iframeCode}
                </code>
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Tooltip placement="top-start" content="Embed Video">
        <button
          type="button"
          onClick={() => openModal()}
          className="rounded-full bg-purple-200 p-2.5 dark:bg-purple-800"
        >
          <CodeOutline className="h-5 w-5" />
        </button>
      </Tooltip>
    </div>
  )
}

export default EmbedVideo
