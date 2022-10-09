import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import { captureException } from '@sentry/nextjs'
import * as tf from '@tensorflow/tfjs'
import { IS_MAINNET } from '@utils/constants'
import { formatBytes } from '@utils/functions/formatBytes'
import { getIsNSFW } from '@utils/functions/getIsNSFW'
import imageCdn from '@utils/functions/imageCdn'
import { sanitizeIpfsUrl } from '@utils/functions/sanitizeIpfsUrl'
import useCopyToClipboard from '@utils/hooks/useCopyToClipboard'
import clsx from 'clsx'
import * as nsfwjs from 'nsfwjs'
import React, { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { IoCopyOutline } from 'react-icons/io5'

import BundlrInfo from './BundlrInfo'
import ChooseThumbnail from './ChooseThumbnail'
import UploadMethod from './UploadMethod'

if (IS_MAINNET) {
  tf.enableProdMode()
}

const Video = () => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)
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
        captureException(error)
      }
    }
  }

  const onDataLoaded = async (event: Event) => {
    if (videoRef.current?.duration) {
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

  const onCopyKey = async (value: string) => {
    await copy(value)
    toast.success('Video link copied')
  }

  const onThumbnailUpload = (ipfsUrl: string, thumbnailType: string) => {
    setUploadedVideo({ thumbnail: ipfsUrl, thumbnailType })
  }

  return (
    <div className="flex flex-col w-full">
      <div
        className={clsx('overflow-hidden rounded-xl w-full', {
          '!rounded-b-none': uploadedVideo.percent !== 0
        })}
      >
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
        >
          <source src={uploadedVideo.preview} type="video/mp4" />
        </video>
      </div>
      <Tooltip content={`Uploaded (${uploadedVideo.percent}%)`}>
        <div
          className={clsx('w-full overflow-hidden bg-gray-200 rounded-b-full', {
            invisible: uploadedVideo.percent === 0
          })}
        >
          <div
            className={clsx('h-[6px]', {
              'bg-indigo-500': uploadedVideo.percent !== 0
            })}
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
      <div className="p-1 mt-3 rounded-lg">
        {uploadedVideo.file?.size && (
          <div className="mt-4">
            <div className="text-xs font-semibold opacity-70">Size</div>
            <span>{formatBytes(uploadedVideo.file?.size)}</span>
          </div>
        )}
        <div className="mt-4">
          <div className="text-xs font-semibold opacity-70">Video Link</div>
          <div className="flex items-center">
            {uploadedVideo.videoSource ? (
              <>
                <span className="truncate">{uploadedVideo.videoSource}</span>
                <button
                  className="pl-2 hover:opacity-60 focus:outline-none"
                  onClick={() => onCopyKey(uploadedVideo.videoSource)}
                  type="button"
                >
                  <IoCopyOutline />
                </button>
              </>
            ) : (
              '-'
            )}
          </div>
        </div>
        {!uploadedVideo.isUploadToIpfs && (
          <div className="mt-4">
            <BundlrInfo />
          </div>
        )}
        <div className="mt-4">
          <UploadMethod />
        </div>
      </div>
    </div>
  )
}

export default Video
