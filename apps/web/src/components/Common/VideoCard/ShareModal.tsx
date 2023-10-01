import Modal from '@components/UIElements/Modal'
import { Analytics, TRACK, useCopyToClipboard } from '@lenstube/browser'
import { LENSTUBE_WEBSITE_URL, STATIC_ASSETS } from '@lenstube/constants'
import { getSharableLink, imageCdn } from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import { t } from '@lingui/macro'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import type { FC } from 'react'
import React from 'react'
import toast from 'react-hot-toast'

import EmbedVideo from '../EmbedVideo'
import CopyOutline from '../Icons/CopyOutline'
import MirrorOutline from '../Icons/MirrorOutline'
import MirrorVideo from '../MirrorVideo'

type Props = {
  video: Publication
  show: boolean
  setShowShare: React.Dispatch<boolean>
}

const ShareModal: FC<Props> = ({ show, setShowShare, video }) => {
  const [copy] = useCopyToClipboard()
  const { resolvedTheme } = useTheme()

  const onCopyVideoUrl = async () => {
    await copy(`${LENSTUBE_WEBSITE_URL}/watch/${video.id}`)
    toast.success(t`Permalink copied to clipboard`)
    Analytics.track(TRACK.PUBLICATION.PERMALINK)
  }

  return (
    <Modal
      title="Share"
      onClose={() => setShowShare(false)}
      show={show}
      panelClassName="max-w-md"
    >
      <div className="mt-2">
        <div className="no-scrollbar mb-4 flex flex-nowrap items-center space-x-3 overflow-x-auto">
          <EmbedVideo videoId={video.id} onClose={() => setShowShare(false)} />
          <MirrorVideo
            video={video}
            onMirrorSuccess={() => setShowShare(false)}
          >
            <div className="rounded-full bg-gray-200 p-3 dark:bg-gray-800">
              <MirrorOutline className="h-5 w-5" />
            </div>
          </MirrorVideo>
          <Link
            className="rounded-full"
            target="_blank"
            rel="noreferrer"
            onClick={() => Analytics.track(TRACK.PUBLICATION.SHARE.HEY)}
            href={getSharableLink('hey', video)}
          >
            <img
              src={imageCdn(
                `${STATIC_ASSETS}/images/social/hey-logo.svg`,
                'AVATAR_LG'
              )}
              className="h-10 w-10 max-w-none rounded-full"
              loading="eager"
              alt="hey"
              draggable={false}
            />
          </Link>
          <span className="middot" />
          <Link
            className="rounded-full"
            target="_blank"
            rel="noreferrer"
            href={getSharableLink('x', video)}
            onClick={() => Analytics.track(TRACK.PUBLICATION.SHARE.X)}
          >
            <div className="rounded-full bg-gray-200 p-3 dark:bg-gray-800">
              {resolvedTheme === 'dark' ? (
                <img
                  src={imageCdn(
                    `${STATIC_ASSETS}/images/social/x-white.png`,
                    'AVATAR'
                  )}
                  className="h-4 w-4"
                  height={16}
                  width={16}
                  alt="X Logo"
                  draggable={false}
                />
              ) : (
                <img
                  src={imageCdn(
                    `${STATIC_ASSETS}/images/social/x-black.png`,
                    'AVATAR'
                  )}
                  className="h-4 w-4"
                  height={16}
                  width={16}
                  alt="X Logo"
                  draggable={false}
                />
              )}
            </div>
          </Link>
          <Link
            href={getSharableLink('reddit', video)}
            onClick={() => Analytics.track(TRACK.PUBLICATION.SHARE.REDDIT)}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={imageCdn(
                `${STATIC_ASSETS}/images/social/reddit-logo.webp`,
                'AVATAR_LG'
              )}
              className="h-10 w-10 max-w-none rounded-full"
              loading="eager"
              alt="reddit"
              draggable={false}
            />
          </Link>
          <Link
            href={getSharableLink('linkedin', video)}
            target="_blank"
            onClick={() => Analytics.track(TRACK.PUBLICATION.SHARE.LINKEDIN)}
            rel="noreferrer"
          >
            <img
              src={imageCdn(
                `${STATIC_ASSETS}/images/social/linkedin-logo.png`,
                'AVATAR_LG'
              )}
              loading="eager"
              alt="linkedin"
              className="h-10 w-10 max-w-none rounded-full"
              draggable={false}
            />
          </Link>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-2 dark:border-gray-800">
          <div className="select-all truncate text-sm">
            {LENSTUBE_WEBSITE_URL}/watch/{video.id}
          </div>
          <button
            className="ml-2 hover:opacity-60 focus:outline-none"
            onClick={() => onCopyVideoUrl()}
            type="button"
          >
            <CopyOutline className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ShareModal
