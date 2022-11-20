import Modal from '@components/UIElements/Modal'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import toast from 'react-hot-toast'
import { IoCopyOutline } from 'react-icons/io5'
import type { LenstubePublication } from 'utils'
import { Analytics, LENSTUBE_WEBSITE_URL, STATIC_ASSETS, TRACK } from 'utils'
import { getSharableLink } from 'utils/functions/getSharableLink'
import imageCdn from 'utils/functions/imageCdn'
import useCopyToClipboard from 'utils/hooks/useCopyToClipboard'

import EmbedVideo from '../EmbedVideo'
import MirrorOutline from '../Icons/MirrorOutline'
import MirrorVideo from '../MirrorVideo'

type Props = {
  video: LenstubePublication
  show: boolean
  setShowShare: React.Dispatch<boolean>
}

const ShareModal: FC<Props> = ({ show, setShowShare, video }) => {
  const [copy] = useCopyToClipboard()

  const onCopyVideoUrl = async () => {
    await copy(`${LENSTUBE_WEBSITE_URL}/watch/${video.id}`)
    toast.success('Link copied to clipboard')
    Analytics.track(TRACK.COPY.VIDEO_URL)
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
          <EmbedVideo videoId={video.id} onClose={() => setShowShare(false)} />
          <MirrorVideo
            video={video}
            onMirrorSuccess={() => setShowShare(false)}
          >
            <div className="p-3.5 bg-gray-200 dark:bg-gray-800 rounded-full">
              <MirrorOutline className="w-5 h-5" />
            </div>
          </MirrorVideo>
          <Link
            className="rounded-full"
            target="_blank"
            rel="noreferrer"
            onClick={() => Analytics.track(TRACK.SHARE_VIDEO.LENSTER)}
            href={getSharableLink('lenster', video)}
          >
            <img
              src={imageCdn(
                `${STATIC_ASSETS}/images/lenster-logo.svg`,
                'avatar_lg'
              )}
              className="w-10 h-10 rounded-full"
              loading="eager"
              alt="lenster"
              draggable={false}
            />
          </Link>
          <span className="middot" />
          <Link
            className="rounded-full"
            target="_blank"
            rel="noreferrer"
            href={getSharableLink('twitter', video)}
            onClick={() => Analytics.track(TRACK.SHARE_VIDEO.TWITTER)}
          >
            <img
              src={imageCdn(
                `${STATIC_ASSETS}/images/social/twitter-logo.png`,
                'avatar_lg'
              )}
              loading="eager"
              className="w-10 h-10 rounded-full"
              alt="twitter"
              draggable={false}
            />
          </Link>
          <Link
            href={getSharableLink('reddit', video)}
            onClick={() => Analytics.track(TRACK.SHARE_VIDEO.REDDIT)}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={imageCdn(
                `${STATIC_ASSETS}/images/social/reddit-logo.webp`,
                'avatar_lg'
              )}
              className="w-10 h-10 rounded-full"
              loading="eager"
              alt="reddit"
              draggable={false}
            />
          </Link>
          <Link
            href={getSharableLink('linkedin', video)}
            target="_blank"
            onClick={() => Analytics.track(TRACK.SHARE_VIDEO.LINKEDIN)}
            rel="noreferrer"
          >
            <img
              src={imageCdn(
                `${STATIC_ASSETS}/images/social/linkedin-logo.png`,
                'avatar_lg'
              )}
              loading="eager"
              alt="linkedin"
              className="w-10 h-10 rounded-full"
              draggable={false}
            />
          </Link>
        </div>
        <div className="flex items-center justify-between p-2 border border-gray-200 rounded-lg dark:border-gray-800">
          <div className="text-sm truncate select-all">
            {LENSTUBE_WEBSITE_URL}/watch/{video.id}
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
