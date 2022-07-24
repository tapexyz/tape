import clsx from 'clsx'
import React, { FC, useState } from 'react'
import { StreamData } from 'src/types/local'

type Props = {
  stream: StreamData
}

const Preview: FC<Props> = ({ stream }) => {
  const [isStreamActive] = useState(false)
  // const [currentInterval, setCurrentInterval] = useState<NodeJS.Timer>()

  // const pollStream = async () => {
  //   const response = await axios.get(`/api/video/stream?id=${stream.streamId}`)
  //   if (response.data.success) {
  //     setIsStreamActive(response.data.isActive)
  //   }
  // }

  // useEffect(() => {
  //   if (stream.streamId) {
  //     clearInterval(currentInterval)
  //     const id = setInterval(() => pollStream(), 2000)
  //     setCurrentInterval(id)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [stream.streamId])

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src={
            isStreamActive
              ? `https://lvpr.tv?v=${stream.playbackId}`
              : undefined
          }
          frameBorder="0"
          allowFullScreen
          className="w-full bg-gray-300 dark:bg-gray-700"
          allow="autoplay; encrypted-media; picture-in-picture"
          sandbox="allow-scripts"
        />
      </div>
      <span
        className={clsx(
          'absolute px-3 py-0.5 mt-2 text-xs text-white rounded-full top-1 right-4',
          {
            'bg-green-500': isStreamActive,
            'bg-black': !isStreamActive
          }
        )}
      >
        {isStreamActive ? 'Active' : 'Idle'}
      </span>
    </div>
  )
}

export default Preview
