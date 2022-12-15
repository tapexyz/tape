import useEchoStore from '@lib/store/echos'
import type { FC } from 'react'
import React from 'react'
import AudioPlayer from 'web-ui/AudioPlayer'

type Props = {
  children: React.ReactNode
}

const Wrapper: FC<Props> = ({ children }) => {
  const selectedTrack = useEchoStore((state) => state.selectedTrack)

  return (
    <div className="max-w-[100rem] relative">
      {children}
      {selectedTrack && (
        <div className="sticky bottom-0 z-10 w-full p-2 bg-white border-t border-x rounded-t-xl dark:border-gray-700 dark:bg-black backdrop-blur-lg">
          <AudioPlayer selectedTrack={selectedTrack} />
        </div>
      )}
    </div>
  )
}

export default Wrapper
