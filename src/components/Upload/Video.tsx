import VideoPlayer from '@components/Common/Players/VideoPlayer'
import useAppStore from '@lib/store'
import { getSizeFromBytes } from '@utils/functions/getSizeFromBytes'
import clsx from 'clsx'
import React from 'react'

import BundlrInfo from './BundlrInfo'

type PlayerProps = {
  source: string
  poster: string
}
const MemoizedVideoPlayer = React.memo(({ source, poster }: PlayerProps) => (
  <VideoPlayer
    source={source}
    poster={poster}
    wrapperClassName="!rounded-b-none"
    autoPlay={false}
    controls={['play', 'progress', 'mute', 'volume', 'fullscreen']}
  />
))
MemoizedVideoPlayer.displayName = 'MemoizedVideoPlayer'

const Video = () => {
  const { uploadedVideo } = useAppStore()

  return (
    <div className="flex flex-col w-full">
      <div
        className={clsx('overflow-hidden rounded-xl w-full', {
          // 'rounded-t-lg': uploadMeta.uploading,
          // 'rounded-lg': !uploadMeta.uploading
        })}
      >
        <MemoizedVideoPlayer
          source={uploadedVideo.preview}
          poster={uploadedVideo.thumbnail}
        />
      </div>
      {/* <Tooltip content={`Uploaded (${uploadMeta.percent}%)`}>
              <div className="w-full overflow-hidden bg-gray-200 rounded-b-full">
                <div
                  className={clsx('bg-indigo-800 bg-brand-500', {
                    'h-[6px]': uploadMeta.uploading,
                    'h-0': !uploadMeta.uploading
                  })}
                  style={{
                    width: `${uploadMeta.percent}%`
                  }}
                />
              </div>
            </Tooltip> */}
      <div className="p-1 mt-3 rounded-lg">
        <div>
          <div className="text-xs font-semibold opacity-70">Title</div>
          <span>{uploadedVideo.file?.name}</span>
        </div>
        {uploadedVideo.file?.size && (
          <div className="mt-4">
            <div className="text-xs font-semibold opacity-70">Size</div>
            <span>{getSizeFromBytes(uploadedVideo.file?.size)}</span>
          </div>
        )}
        <div className="mt-4">
          <div className="text-xs font-semibold opacity-70">Video Link</div>
          <span>{uploadedVideo.file?.name}</span>
        </div>
        <div className="mt-4">
          <BundlrInfo />
        </div>
      </div>
    </div>
  )
}

export default Video
