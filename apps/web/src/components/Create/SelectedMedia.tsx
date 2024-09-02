import { tw } from '@tape.xyz/browser'
import { FEATURE_FLAGS } from '@tape.xyz/constants'
import {
  formatBytes,
  getIsFeatureEnabled,
  sanitizeDStorageUrl
} from '@tape.xyz/generic'
import { Badge, Input, Tooltip } from '@tape.xyz/ui'
import React, { useEffect, useRef, useState } from 'react'

import { formatTimeFromSeconds } from '@/lib/formatTime'
import useAppStore from '@/lib/store'
import useProfileStore from '@/lib/store/idb/profile'

import ChooseThumbnail from './ChooseThumbnail'
import UploadMethod from './UploadMethod'

const SelectedMedia = () => {
  const mediaRef = useRef<HTMLVideoElement>(null)
  const [loading, setLoading] = useState(true)
  const [interacted, setInteracted] = useState(false)
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
    setLoading(false)
  }

  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.onloadeddata = onDataLoaded
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaRef])

  const onClickVideo = () => {
    setInteracted(true)
    mediaRef.current?.paused
      ? mediaRef.current?.play()
      : mediaRef.current?.pause()
  }

  return (
    <div className="flex flex-col">
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

        {!loading && (
          <>
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
                    {formatTimeFromSeconds(
                      String(uploadedMedia.durationInSeconds)
                    )}
                  </span>
                  <span>({formatBytes(uploadedMedia.file?.size)})</span>
                </span>
              )}
            </Badge>
            {uploadedMedia.durationInSeconds === 0 &&
            uploadedMedia.file?.size ? (
              <Badge className="absolute right-3 top-3 bg-red-500 text-white">
                <span className="whitespace-nowrap font-bold">
                  Only media files longer than 1 second are allowed
                </span>
              </Badge>
            ) : null}
            {uploadedMedia.percent ? (
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
          </>
        )}
      </div>
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
      <div className="mt-4">
        <ChooseThumbnail file={uploadedMedia.file} />
      </div>
      <div className="rounded-lg">
        <UploadMethod />
      </div>
    </div>
  )
}

export default SelectedMedia
