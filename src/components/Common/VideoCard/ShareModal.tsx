import Modal from '@components/UIElements/Modal'
import { LENSTUBE_URL, STATIC_ASSETS } from '@utils/constants'
import { getSharableLink } from '@utils/functions/getSharableLink'
import imageCdn from '@utils/functions/imageCdn'
import useCopyToClipboard from '@utils/hooks/useCopyToClipboard'
import dynamic from 'next/dynamic'
import React, { FC } from 'react'
import toast from 'react-hot-toast'
import { IoCopyOutline } from 'react-icons/io5'
import { LenstubePublication } from 'src/types/local'

const MirrorVideo = dynamic(() => import('../MirrorVideo'))

type Props = {
  video: LenstubePublication
  show: boolean
  setShowShare: React.Dispatch<boolean>
}

const ShareModal: FC<Props> = ({ show, setShowShare, video }) => {
  const [, copy] = useCopyToClipboard()

  const onCopyVideoUrl = async () => {
    await copy(`${LENSTUBE_URL}/watch/${video.id}`)
    toast.success('Link copied to clipboard')
  }

  return (
    <Modal
      title="Share"
      onClose={() => setShowShare(false)}
      show={show}
      panelClassName="max-w-md"
    >
      <div className="mt-2">
        <div className="flex items-center mb-4 space-x-2 overflow-x-auto flex-nowrap no-scrollbar">
          <MirrorVideo
            video={video}
            onMirrorSuccess={() => setShowShare(false)}
          />
          <a
            className="rounded-full"
            target="_blank"
            rel="noreferrer"
            href={getSharableLink('twitter', video)}
          >
            <img
              src={imageCdn(
                `${STATIC_ASSETS}/images/social/twitter-logo.png`,
                'avatar'
              )}
              className="w-10 h-10 rounded-full"
              alt="twitter"
              draggable={false}
            />
          </a>
          <a href={getSharableLink('reddit', video)}>
            <img
              src={imageCdn(
                `${STATIC_ASSETS}/images/social/reddit-logo.webp`,
                'avatar'
              )}
              className="w-10 h-10 rounded-full"
              alt="reddit"
              draggable={false}
            />
          </a>
          <a href={getSharableLink('linkedin', video)}>
            <img
              src={imageCdn(
                `${STATIC_ASSETS}/images/social/linkedin-logo.png`,
                'avatar'
              )}
              alt="linkedin"
              className="w-10 h-10 rounded-full"
              draggable={false}
            />
          </a>
        </div>
        <div className="flex items-center justify-between p-2 border border-gray-200 rounded-lg dark:border-gray-800">
          <div className="text-sm truncate select-all">
            {LENSTUBE_URL}/watch/{video.id}
          </div>
          <button
            className="ml-2 hover:opacity-60 focus:outline-none"
            onClick={() => onCopyVideoUrl()}
            type="button"
          >
            <IoCopyOutline />
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ShareModal
