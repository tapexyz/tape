import AddImageOutline from '@components/Common/Icons/AddImageOutline'
import { Input } from '@components/UIElements/Input'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import useProfileStore from '@lib/store/profile'
import { AspectRatio, Badge } from '@radix-ui/themes'
import { uploadToIPFS } from '@tape.xyz/browser'
import { ALLOWED_AUDIO_MIME_TYPES, FEATURE_FLAGS } from '@tape.xyz/constants'
import {
  formatBytes,
  getIsFeatureEnabled,
  sanitizeDStorageUrl
} from '@tape.xyz/generic'
import type { IPFSUploadResult } from '@tape.xyz/lens/custom-types'
import { Loader } from '@tape.xyz/ui'
import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'

import ChooseThumbnail from './ChooseThumbnail'
import UploadMethod from './UploadMethod'

const SelectedMedia = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [interacted, setInteracted] = useState(false)
  const [posterPreview, setPosterPreview] = useState('')
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const { uploadedVideo, setUploadedVideo } = useAppStore()

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

  const isAudio = ALLOWED_AUDIO_MIME_TYPES.includes(uploadedVideo.mediaType)

  const onClickVideo = () => {
    setInteracted(true)
    videoRef.current?.paused
      ? videoRef.current?.play()
      : videoRef.current?.pause()
  }

  return (
    <div className="flex w-full flex-col">
      {isAudio ? (
        <div className="flex w-full justify-end">
          <div className="md:rounded-large rounded-small w-3/5 space-y-2 overflow-hidden border p-2 dark:border-gray-800">
            <AspectRatio ratio={1 / 1} className="group relative">
              {posterPreview ? (
                <img
                  src={posterPreview}
                  className="h-full w-full object-cover"
                  draggable={false}
                  alt="poster"
                />
              ) : null}
              <label
                htmlFor="choosePoster"
                className={clsx(
                  'invisible absolute top-0 grid h-full w-full cursor-pointer place-items-center rounded-full bg-white bg-opacity-70 backdrop-blur-lg group-hover:visible dark:bg-black',
                  {
                    '!visible':
                      uploadedVideo.uploadingThumbnail ||
                      !uploadedVideo.thumbnail.length
                  }
                )}
              >
                {uploadedVideo.uploadingThumbnail ? (
                  <Loader />
                ) : (
                  <span className="inline-flex flex-col items-center space-y-2">
                    <AddImageOutline className="h-5 w-5" />
                    <span>Upload Poster</span>
                  </span>
                )}
                <input
                  id="choosePoster"
                  type="file"
                  accept=".png, .jpg, .jpeg, .svg, .gif"
                  className="hidden w-full"
                  onChange={async (e) => {
                    if (e.target.files?.length) {
                      const file = e.target.files[0]
                      setUploadedVideo({ uploadingThumbnail: true })
                      const preview = URL.createObjectURL(file)
                      setPosterPreview(preview)
                      const { url }: IPFSUploadResult = await uploadToIPFS(file)
                      setUploadedVideo({
                        uploadingThumbnail: false,
                        thumbnail: url
                      })
                    }
                  }}
                />
              </label>
            </AspectRatio>
            <audio
              controls
              controlsList="nodownload noplaybackrate"
              className="w-full"
              src={uploadedVideo.preview}
            />
          </div>
        </div>
      ) : (
        <div className="md:rounded-large rounded-small relative w-full cursor-pointer overflow-hidden border dark:border-gray-800">
          <video
            ref={videoRef}
            className="aspect-[16/9] w-full"
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload noplaybackrate"
            poster={sanitizeDStorageUrl(uploadedVideo.thumbnail)}
            controls={false}
            autoPlay={interacted}
            muted={!interacted}
            onClick={() => onClickVideo()}
            src={uploadedVideo.preview}
          />
          <Badge
            onClick={() => onClickVideo()}
            variant="solid"
            radius="full"
            highContrast
            className="absolute right-2 top-2"
          >
            Play/Pause
          </Badge>
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
      )}
      {getIsFeatureEnabled(
        FEATURE_FLAGS.POST_WITH_SOURCE_URL,
        activeProfile?.id
      ) && (
        <div className="mt-4">
          <Input
            label="Upload from Source URL"
            info="Skip the media upload (Only use this if you know what you are doing!)"
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
      {!isAudio && (
        <div className="mt-4">
          <ChooseThumbnail file={uploadedVideo.file} />
        </div>
      )}
      <div className="rounded-lg">
        <UploadMethod />
      </div>
    </div>
  )
}

export default SelectedMedia
