import CopyOutline from '@components/Common/Icons/CopyOutline'
import Tooltip from '@components/UIElements/Tooltip'
import usePersistStore from '@lib/store/persist'
import * as tf from '@tensorflow/tfjs'
import clsx from 'clsx'
import * as nsfwjs from 'nsfwjs'
import React, { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { IS_MAINNET } from 'utils'
import formatBytes from 'utils/functions/formatBytes'
import { getIsNSFW } from 'utils/functions/getIsNSFW'
import imageCdn from 'utils/functions/imageCdn'
import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl'
import useCopyToClipboard from 'utils/hooks/useCopyToClipboard'
import logger from 'utils/logger'

import ChooseThumbnail from './ChooseThumbnail'
import UploadMethod from './UploadMethod'

if (IS_MAINNET) {
  tf.enableProdMode()
}

const Video = () => {
  const uploadedVideo = usePersistStore((state) => state.uploadedVideo)
  const setUploadedVideo = usePersistStore((state) => state.setUploadedVideo)
  const [copy] = useCopyToClipboard()
  const videoRef = useRef<HTMLVideoElement>(null)

  const analyseVideo = async (currentVideo: HTMLVideoElement) => {
    if (currentVideo && !uploadedVideo.isNSFW) {
      try {
        const model = await nsfwjs.load()
        const predictions = await model?.classify(currentVideo, 3)
        setUploadedVideo({
          isNSFW: getIsNSFW(predictions)
        })
      } catch (error) {
        logger.error('[Error Analyse Video]', error)
      }
    }
  }

  const onDataLoaded = async (event: Event) => {
    if (videoRef.current?.duration && videoRef.current?.duration !== Infinity) {
      setUploadedVideo({
        durationInSeconds: videoRef.current.duration.toFixed(2)
      })
    }
    if (event.target) {
      const currentVideo = document.getElementsByTagName('video')[0]
      await analyseVideo(currentVideo)
    }
  }

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadeddata = onDataLoaded
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef])

  const onCopyVideoSource = async (value: string) => {
    await copy(value)
    toast.success('Video source copied')
  }

  const onThumbnailUpload = (ipfsUrl: string, thumbnailType: string) => {
    setUploadedVideo({ thumbnail: ipfsUrl, thumbnailType })
  }

  return (
    <div className="flex flex-col w-full">
      <div className="overflow-hidden relative rounded-xl rounded-b-none w-full">
        <video
          ref={videoRef}
          className="w-full aspect-[16/9]"
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noplaybackrate"
          poster={imageCdn(
            sanitizeIpfsUrl(uploadedVideo.thumbnail),
            'thumbnail'
          )}
          controls
          src={uploadedVideo.preview}
        >
          <source
            src={uploadedVideo.preview}
            type={uploadedVideo.videoType || 'video/mp4'}
          />
        </video>
        <div className="py-0.5 absolute top-2 px-2 left-2 text-xs uppercase bg-orange-200 text-black rounded-full">
          {uploadedVideo.file?.size && (
            <span className="whitespace-nowrap font-semibold">
              {formatBytes(uploadedVideo.file?.size)}
            </span>
          )}
        </div>
        {uploadedVideo.videoSource && (
          <Tooltip placement="left" content="Copy source URL">
            <button
              type="button"
              onClick={() => onCopyVideoSource(uploadedVideo.videoSource)}
              className="absolute outline-none top-2 p-1 px-1.5 right-2 text-xs bg-orange-200 text-black rounded-lg"
            >
              <CopyOutline className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
        )}
      </div>
      <Tooltip content={`Uploaded (${uploadedVideo.percent}%)`}>
        <div className="w-full overflow-hidden bg-gray-200 rounded-b-full">
          <div
            className={clsx(
              'h-[6px]',
              uploadedVideo.percent !== 0
                ? 'bg-indigo-500'
                : 'bg-gray-300 dark:bg-gray-800'
            )}
            style={{
              width: `${uploadedVideo.percent}%`
            }}
          />
        </div>
      </Tooltip>
      <div className="mt-4">
        <ChooseThumbnail
          label="Thumbnail"
          file={uploadedVideo.file}
          afterUpload={(ipfsUrl: string, thumbnailType: string) => {
            if (!ipfsUrl?.length) {
              return toast.error('Failed to upload thumbnail')
            }
            onThumbnailUpload(ipfsUrl, thumbnailType)
          }}
        />
      </div>
      <div className="rounded-lg">
        <UploadMethod />
      </div>
    </div>
  )
}

export default Video
