import { Input } from '@components/UIElements/Input'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import useAuthPersistStore from '@lib/store/auth'
import { t } from '@lingui/macro'
import { Badge } from '@radix-ui/themes'
import { FEATURE_FLAGS } from '@tape.xyz/constants'
import {
  formatBytes,
  getIsFeatureEnabled,
  sanitizeDStorageUrl
} from '@tape.xyz/generic'
import clsx from 'clsx'
import React, { useEffect, useRef } from 'react'

import ChooseThumbnail from './ChooseThumbnail'
import UploadMethod from './UploadMethod'

const SelectedMedia = () => {
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)
  const videoRef = useRef<HTMLVideoElement>(null)

  const onDataLoaded = () => {
    if (videoRef.current?.duration && videoRef.current?.duration !== Infinity) {
      setUploadedVideo({
        durationInSeconds: videoRef.current.duration
          ? Math.floor(videoRef.current.duration)
          : 0
      })
    }
  }

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadeddata = onDataLoaded
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef])

  return (
    <div className="flex w-full flex-col">
      <div className="md:rounded-large rounded-small group relative w-full cursor-pointer overflow-hidden border dark:border-gray-800">
        <video
          ref={videoRef}
          className="aspect-[16/9] w-full"
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noplaybackrate"
          poster={sanitizeDStorageUrl(uploadedVideo.thumbnail)}
          controls={false}
          autoPlay
          onClick={() =>
            videoRef.current?.paused
              ? videoRef.current?.play()
              : videoRef.current?.pause()
          }
          src={uploadedVideo.preview}
        />
        <Badge
          variant="solid"
          radius="full"
          highContrast
          className="absolute left-2 top-2"
        >
          {uploadedVideo.file?.size && (
            <span className="whitespace-nowrap font-bold">
              {formatBytes(uploadedVideo.file?.size)}
            </span>
          )}
        </Badge>
        {uploadedVideo.durationInSeconds === 0 ? (
          <Badge
            variant="solid"
            radius="full"
            color="red"
            className="absolute right-3 top-3"
          >
            <span className="whitespace-nowrap font-bold">
              Only media files longer than 1 second are allowed
            </span>
          </Badge>
        ) : null}
        {Boolean(uploadedVideo.percent) ? (
          <Tooltip content={`Uploaded (${uploadedVideo.percent}%)`}>
            <div className="absolute bottom-0 w-full overflow-hidden bg-gray-200">
              <div
                className={clsx(
                  'h-[6px]',
                  uploadedVideo.percent !== 0
                    ? 'bg-brand-500'
                    : 'bg-gray-300 dark:bg-gray-800'
                )}
                style={{
                  width: `${uploadedVideo.percent}%`
                }}
              />
            </div>
          </Tooltip>
        ) : null}
      </div>
      {getIsFeatureEnabled(
        FEATURE_FLAGS.POST_WITH_SOURCE_URL,
        selectedSimpleProfile?.id
      ) && (
        <div className="mt-4">
          <Input
            info={t`Skip the video upload (Only use this if you know what your doing!)`}
            label={t`Upload from Source Url`}
            placeholder="ar:// or ipfs://"
            value={uploadedVideo.videoSource}
            onChange={(e) =>
              setUploadedVideo({
                videoSource: e.target.value
              })
            }
          />
        </div>
      )}
      <div className="mt-4">
        <ChooseThumbnail file={uploadedVideo.file} />
      </div>
      <div className="rounded-lg">
        <UploadMethod />
      </div>
    </div>
  )
}

export default SelectedMedia
