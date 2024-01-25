import { getTimeFromSeconds } from '@lib/formatTime'
import useAppStore from '@lib/store'
import useProfileStore from '@lib/store/idb/profile'
import { tw, uploadToIPFS } from '@tape.xyz/browser'
import { ALLOWED_AUDIO_MIME_TYPES, FEATURE_FLAGS } from '@tape.xyz/constants'
import {
  formatBytes,
  getIsFeatureEnabled,
  sanitizeDStorageUrl
} from '@tape.xyz/generic'
import type { IPFSUploadResult } from '@tape.xyz/lens/custom-types'
import { AddImageOutline, Badge, Input, Spinner, Tooltip } from '@tape.xyz/ui'
import React, { useEffect, useRef, useState } from 'react'

import ChooseThumbnail from './ChooseThumbnail'
import UploadMethod from './UploadMethod'

const SelectedMedia = () => {
  const mediaRef = useRef<HTMLVideoElement>(null)
  const [interacted, setInteracted] = useState(false)
  const [posterPreview, setPosterPreview] = useState('')
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const uploadedMedia = useAppStore((state) => state.uploadedMedia)
  const setUploadedMedia = useAppStore((state) => state.setUploadedMedia)

  const onDataLoaded = () => {
    if (mediaRef.current?.duration && mediaRef.current?.duration !== Infinity) {
      setUploadedMedia({
        durationInSeconds: mediaRef.current.duration
          ? Math.floor(mediaRef.current.duration)
          : 0
      })
    }
  }

  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.onloadeddata = onDataLoaded
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaRef])

  const isAudio = ALLOWED_AUDIO_MIME_TYPES.includes(uploadedMedia.mediaType)

  const onClickVideo = () => {
    setInteracted(true)
    mediaRef.current?.paused
      ? mediaRef.current?.play()
      : mediaRef.current?.pause()
  }

  return (
    <div className="flex flex-col">
      {isAudio ? (
        <div className="flex w-full justify-end">
          <div className="md:rounded-medium rounded-small tape-border w-full space-y-2 overflow-hidden p-2">
            <div className="group relative aspect-[1/1]">
              {posterPreview ? (
                <img
                  src={posterPreview}
                  className="rounded-small h-full w-full object-cover"
                  draggable={false}
                  alt="poster"
                />
              ) : null}
              <label
                htmlFor="choosePoster"
                className={tw(
                  'rounded-small invisible absolute top-0 grid h-full w-full cursor-pointer place-items-center overflow-hidden bg-gray-100 bg-opacity-70 backdrop-blur-lg group-hover:visible dark:bg-black',
                  {
                    '!visible':
                      uploadedMedia.uploadingThumbnail ||
                      !uploadedMedia.thumbnail.length
                  }
                )}
              >
                {uploadedMedia.uploadingThumbnail ? (
                  <Spinner />
                ) : (
                  <span className="inline-flex flex-col items-center space-y-2">
                    <AddImageOutline className="size-5" />
                    <span>Select Poster</span>
                  </span>
                )}
                <input
                  id="choosePoster"
                  type="file"
                  accept=".png, .jpg, .jpeg, .svg, .gif, .webp"
                  className="hidden w-full"
                  onChange={async (e) => {
                    if (e.target.files?.length) {
                      const file = e.target.files[0]
                      setUploadedMedia({ uploadingThumbnail: true })
                      const preview = URL.createObjectURL(file)
                      setPosterPreview(preview)
                      const { url }: IPFSUploadResult = await uploadToIPFS(file)
                      setUploadedMedia({
                        uploadingThumbnail: false,
                        thumbnail: url
                      })
                    }
                  }}
                />
              </label>
            </div>
            <audio
              ref={mediaRef}
              src={uploadedMedia.preview}
              className="w-full"
              controlsList="nodownload noplaybackrate"
              controls
            />
          </div>
        </div>
      ) : (
        <div className="md:rounded-large rounded-small relative w-full cursor-pointer overflow-hidden border dark:border-gray-800">
          <video
            ref={mediaRef}
            className="aspect-[16/9] w-full object-cover"
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload noplaybackrate"
            poster={
              uploadedMedia.thumbnailBlobUrl ||
              sanitizeDStorageUrl(uploadedMedia.thumbnail)
            }
            controls={false}
            autoPlay={interacted}
            muted={!interacted}
            onClick={() => onClickVideo()}
            src={uploadedMedia.preview}
          />
          <Badge
            onClick={() => onClickVideo()}
            className="absolute bottom-3 right-2"
          >
            Play/Pause
          </Badge>
          <Badge className="absolute bottom-3 left-2">
            {uploadedMedia.file?.size && (
              <span className="space-x-1 whitespace-nowrap">
                <span>
                  {getTimeFromSeconds(String(uploadedMedia.durationInSeconds))}
                </span>
                <span>({formatBytes(uploadedMedia.file?.size)})</span>
              </span>
            )}
          </Badge>
          {uploadedMedia.durationInSeconds === 0 ? (
            <Badge className="absolute right-3 top-3 bg-red-500 text-white">
              <span className="whitespace-nowrap font-bold">
                Only media files longer than 1 second are allowed
              </span>
            </Badge>
          ) : null}
          {Boolean(uploadedMedia.percent) ? (
            <Tooltip content={`Uploaded (${uploadedMedia.percent}%)`}>
              <div className="absolute bottom-0 w-full overflow-hidden bg-gray-200">
                <div
                  className={tw(
                    'h-[6px]',
                    uploadedMedia.percent !== 0
                      ? 'bg-brand-500'
                      : 'bg-gray-300 dark:bg-gray-800'
                  )}
                  style={{
                    width: `${uploadedMedia.percent}%`
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
            value={uploadedMedia.dUrl}
            onChange={(e) =>
              setUploadedMedia({
                dUrl: e.target.value
              })
            }
          />
        </div>
      )}
      {!isAudio && (
        <div className="mt-4">
          <ChooseThumbnail file={uploadedMedia.file} />
        </div>
      )}
      <div className="rounded-lg">
        <UploadMethod />
      </div>
    </div>
  )
}

export default SelectedMedia
